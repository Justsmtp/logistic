const Delivery = require('../models/Delivery');
const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendDeliveryUpdate, sendDriverNotification } = require('../utils/whatsapp');
const fs = require('fs').promises;

/**
 * @desc    Create new delivery
 * @route   POST /api/deliveries
 * @access  Private (Admin/Customer)
 */
exports.createDelivery = async (req, res, next) => {
  try {
    const {
      customerPhone,
      customerName,
      pickupAddress,
      deliveryAddress,
      packageDetails,
      specialInstructions,
      priority,
      estimatedDeliveryTime
    } = req.body;

    // Set customer from authenticated user or create guest entry
    let customerId = req.user.id;
    
    // Create delivery
    const delivery = await Delivery.create({
      customer: customerId,
      customerName: customerName || req.user.name,
      customerPhone: customerPhone || req.user.phone,
      pickupAddress,
      deliveryAddress,
      packageDetails,
      specialInstructions,
      priority: priority || 'medium',
      estimatedDeliveryTime,
      price: calculatePrice(packageDetails, pickupAddress, deliveryAddress),
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Delivery created'
      }]
    });

    // Populate customer details
    await delivery.populate('customer', 'name email phone');

    // Send WhatsApp notification
    await sendDeliveryUpdate(
      delivery.customerPhone,
      delivery.trackingNumber,
      'pending'
    );

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all deliveries (with filters)
 * @route   GET /api/deliveries
 * @access  Private
 */
exports.getDeliveries = async (req, res, next) => {
  try {
    const { status, priority, dateFrom, dateTo, search } = req.query;
    
    // Build query
    let query = {};

    // Role-based filtering
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'driver') {
      query.driver = req.user.id;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Search by tracking number or customer name
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const deliveries = await Delivery.find(query)
      .populate('customer', 'name email phone')
      .populate('driver', 'name phone vehicleType vehicleNumber rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Delivery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: deliveries.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: deliveries
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single delivery
 * @route   GET /api/deliveries/:id
 * @access  Private
 */
exports.getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('driver', 'name phone vehicleType vehicleNumber rating currentLocation');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Check authorization
    if (
      req.user.role === 'customer' && 
      delivery.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this delivery'
      });
    }

    if (
      req.user.role === 'driver' && 
      (!delivery.driver || delivery.driver._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this delivery'
      });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track delivery by tracking number
 * @route   GET /api/deliveries/track/:trackingNumber
 * @access  Public
 */
exports.trackDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findOne({ 
      trackingNumber: req.params.trackingNumber.toUpperCase() 
    })
      .populate('driver', 'name phone vehicleType vehicleNumber currentLocation')
      .select('-internalNotes -whatsappNotificationsSent');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Invalid tracking number'
      });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate delivery price
function calculatePrice(packageDetails, pickupAddress, deliveryAddress) {
  // Base price
  let price = 1000; // ₦1000 base

  // Weight-based pricing
  if (packageDetails.weight) {
    price += packageDetails.weight * 100; // ₦100 per kg
  }

  // Priority pricing
  const priorityMultiplier = {
    low: 1,
    medium: 1.2,
    high: 1.5,
    urgent: 2
  };

  // Distance-based pricing (simplified - in production, use actual distance API)
  const isSameCity = pickupAddress.city === deliveryAddress.city;
  if (!isSameCity) {
    price += 2000; // Inter-city surcharge
  }

  return Math.round(price);

  // Continue from Part 1...

/**
 * @desc    Assign driver to delivery
 * @route   PUT /api/deliveries/:id/assign
 * @access  Private (Admin only)
 */
exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    // Find delivery
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Check if delivery can be assigned
    if (delivery.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending deliveries can be assigned'
      });
    }

    // Find driver
    const driver = await User.findById(driverId);

    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    if (!driver.isAvailable || !driver.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Driver is not available'
      });
    }

    // Assign driver
    delivery.driver = driverId;
    delivery.assignedAt = new Date();
    await delivery.updateStatus('assigned', null, `Assigned to ${driver.name}`);

    await delivery.populate('driver', 'name phone vehicleType vehicleNumber');

    // Send notifications
    await sendDeliveryUpdate(
      delivery.customerPhone,
      delivery.trackingNumber,
      'assigned',
      {
        driverName: driver.name,
        driverPhone: driver.phone,
        vehicleType: driver.vehicleType
      }
    );

    await sendDriverNotification(
      driver.phone,
      delivery.trackingNumber,
      {
        pickupAddress: `${delivery.pickupAddress.address}, ${delivery.pickupAddress.city}`,
        deliveryAddress: `${delivery.deliveryAddress.address}, ${delivery.deliveryAddress.city}`,
        customerName: delivery.customerName,
        customerPhone: delivery.customerPhone,
        packageDescription: delivery.packageDetails.description
      }
    );

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update delivery status
 * @route   PUT /api/deliveries/:id/status
 * @access  Private (Driver/Admin)
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note, longitude, latitude } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Authorization check
    if (req.user.role === 'driver') {
      if (!delivery.driver || delivery.driver.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this delivery'
        });
      }
    }

    // Validate status transition
    const validTransitions = {
      pending: ['assigned', 'cancelled'],
      assigned: ['picked_up', 'cancelled'],
      picked_up: ['in_transit', 'failed'],
      in_transit: ['out_for_delivery', 'failed'],
      out_for_delivery: ['delivered', 'failed'],
      delivered: [],
      failed: [],
      cancelled: []
    };

    if (!validTransitions[delivery.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${delivery.status} to ${status}`
      });
    }

    // Build location object
    let location = null;
    if (longitude && latitude) {
      location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }

    // Update status
    await delivery.updateStatus(status, location, note);

    // Update driver's completed deliveries count
    if (status === 'delivered' && delivery.driver) {
      await User.findByIdAndUpdate(delivery.driver, {
        $inc: { deliveriesCompleted: 1 }
      });
    }

    await delivery.populate('driver', 'name phone vehicleType');

    // Send WhatsApp notification
    const notificationDetails = {};
    
    if (status === 'delivered') {
      notificationDetails.receivedBy = delivery.proofOfDelivery?.receivedBy || 'Customer';
      notificationDetails.deliveryTime = new Date().toLocaleString();
    } else if (status === 'failed') {
      notificationDetails.reason = note || 'Unable to deliver';
    } else if (delivery.driver) {
      notificationDetails.driverName = delivery.driver.name;
      notificationDetails.driverPhone = delivery.driver.phone;
      if (delivery.estimatedDeliveryTime) {
        notificationDetails.estimatedDelivery = new Date(delivery.estimatedDeliveryTime).toLocaleString();
      }
    }

    await sendDeliveryUpdate(
      delivery.customerPhone,
      delivery.trackingNumber,
      status,
      notificationDetails
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: delivery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload proof of delivery
 * @route   POST /api/deliveries/:id/proof
 * @access  Private (Driver only)
 */
exports.uploadProof = async (req, res, next) => {
  try {
    const { receivedBy, signature, notes, longitude, latitude } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Check authorization
    if (!delivery.driver || delivery.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this delivery'
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a proof photo'
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.path, 'deliveries/proof');

    // Delete local file
    await fs.unlink(req.file.path);

    // Build location
    let location = null;
    if (longitude && latitude) {
      location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    // Update delivery
    delivery.proofOfDelivery = {
      photo: {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId
      },
      signature,
      receivedBy,
      notes,
      location,
      timestamp: new Date()
    };

    // Automatically mark as delivered
    await delivery.updateStatus('delivered', location, `Delivered to ${receivedBy}`);

    // Update driver's completed count
    await User.findByIdAndUpdate(delivery.driver, {
      $inc: { deliveriesCompleted: 1 }
    });

    await delivery.populate('driver', 'name phone');

    // Send notification
    await sendDeliveryUpdate(
      delivery.customerPhone,
      delivery.trackingNumber,
      'delivered',
      {
        receivedBy,
        deliveryTime: new Date().toLocaleString()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Proof of delivery uploaded successfully',
      data: delivery
    });
  } catch (error) {
    // Clean up file if upload fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error(err));
    }
    next(error);
  }
};

/**
 * @desc    Delete delivery
 * @route   DELETE /api/deliveries/:id
 * @access  Private (Admin only)
 */
exports.deleteDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Can only delete pending or cancelled deliveries
    if (!['pending', 'cancelled'].includes(delivery.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active deliveries'
      });
    }

    await delivery.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get delivery statistics
 * @route   GET /api/deliveries/stats/summary
 * @access  Private (Admin/Driver)
 */
exports.getStats = async (req, res, next) => {
  try {
    let matchQuery = {};

    if (req.user.role === 'driver') {
      matchQuery.driver = req.user._id;
    }

    const stats = await Delivery.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await Delivery.aggregate([
      { $match: { ...matchQuery, status: 'delivered' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
}


