const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  // Pickup Information
  pickupAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  // Delivery Information
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  // Package Information
  packageDetails: {
    description: { type: String, required: true },
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    value: Number, // monetary value
    category: {
      type: String,
      enum: ['documents', 'electronics', 'food', 'clothing', 'furniture', 'other'],
      default: 'other'
    }
  },
  // Delivery Status
  status: {
    type: String,
    enum: [
      'pending',        // Waiting for driver assignment
      'assigned',       // Driver assigned
      'picked_up',      // Package picked up
      'in_transit',     // On the way
      'out_for_delivery', // Near destination
      'delivered',      // Successfully delivered
      'failed',         // Delivery failed
      'cancelled'       // Cancelled by customer/admin
    ],
    default: 'pending'
  },
  // Driver Assignment
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: Date,
  // Delivery Timeline
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number]
    },
    note: String
  }],
  // Estimated & Actual Times
  estimatedPickupTime: Date,
  estimatedDeliveryTime: Date,
  actualPickupTime: Date,
  actualDeliveryTime: Date,
  // Proof of Delivery
  proofOfDelivery: {
    photo: {
      url: String,
      publicId: String
    },
    signature: String,
    receivedBy: String,
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number]
    },
    timestamp: Date,
    notes: String
  },
  // Pricing
  price: {
    type: Number,
    required: true,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Additional Info
  specialInstructions: String,
  internalNotes: String,
  // WhatsApp Notifications
  whatsappNotificationsSent: [{
    status: String,
    timestamp: Date,
    messageSid: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
deliverySchema.index({ customer: 1 });
deliverySchema.index({ driver: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ 'pickupAddress.location': '2dsphere' });
deliverySchema.index({ 'deliveryAddress.location': '2dsphere' });
deliverySchema.index({ createdAt: -1 });

// Generate tracking number before saving
deliverySchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    const prefix = 'TRK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Method to add timeline entry
deliverySchema.methods.addTimelineEntry = function(status, location, note) {
  this.timeline.push({
    status,
    timestamp: new Date(),
    location,
    note
  });
};

// Method to update status
deliverySchema.methods.updateStatus = async function(newStatus, location, note) {
  this.status = newStatus;
  this.addTimelineEntry(newStatus, location, note);
  
  // Update specific timestamps
  if (newStatus === 'picked_up' && !this.actualPickupTime) {
    this.actualPickupTime = new Date();
  } else if (newStatus === 'delivered' && !this.actualDeliveryTime) {
    this.actualDeliveryTime = new Date();
  }
  
  await this.save();
};

module.exports = mongoose.model('Delivery', deliverySchema);