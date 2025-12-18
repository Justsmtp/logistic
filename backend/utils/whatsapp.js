const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Format phone number for WhatsApp
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith('234')) {
    // Remove leading zero if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    // Add Nigeria country code
    cleaned = '234' + cleaned;
  }
  
  return `whatsapp:+${cleaned}`;
};

/**
 * Send WhatsApp message
 * @param {string} to - Recipient phone number
 * @param {string} message - Message content
 * @returns {Promise} - Twilio message object
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedNumber = formatPhoneNumber(to);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedNumber
    });

    console.log(`✅ WhatsApp sent to ${to}: ${result.sid}`);
    
    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error(`❌ WhatsApp send failed to ${to}:`, error.message);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send delivery status update
 * @param {string} phone - Customer phone number
 * @param {string} trackingNumber - Tracking number
 * @param {string} status - Delivery status
 * @param {Object} details - Additional details
 */
const sendDeliveryUpdate = async (phone, trackingNumber, status, details = {}) => {
  const messages = {
    pending: `📦 *Delivery Created*\n\nYour package is being processed.\n\nTracking: ${trackingNumber}\n\nWe'll notify you when a driver is assigned.`,
    
    assigned: `🚚 *Driver Assigned*\n\nDriver: ${details.driverName}\nPhone: ${details.driverPhone}\nVehicle: ${details.vehicleType}\n\nTracking: ${trackingNumber}\n\nYour package will be picked up soon.`,
    
    picked_up: `✅ *Package Picked Up*\n\nYour package has been picked up by ${details.driverName}.\n\nTracking: ${trackingNumber}\n\nEstimated Delivery: ${details.estimatedDelivery}`,
    
    in_transit: `🛣️ *In Transit*\n\nYour package is on its way!\n\nTracking: ${trackingNumber}\n\nEstimated Arrival: ${details.estimatedDelivery}`,
    
    out_for_delivery: `📍 *Out for Delivery*\n\nYour package is nearby and will be delivered shortly.\n\nDriver: ${details.driverName}\nPhone: ${details.driverPhone}\n\nTracking: ${trackingNumber}`,
    
    delivered: `✨ *Delivered Successfully*\n\nYour package has been delivered!\n\nDelivered to: ${details.receivedBy}\nTime: ${details.deliveryTime}\n\nTracking: ${trackingNumber}\n\nThank you for using our service!`,
    
    failed: `⚠️ *Delivery Failed*\n\nWe couldn't deliver your package.\n\nReason: ${details.reason}\n\nTracking: ${trackingNumber}\n\nPlease contact support.`,
    
    cancelled: `❌ *Delivery Cancelled*\n\nYour delivery has been cancelled.\n\nTracking: ${trackingNumber}\n\nReason: ${details.reason || 'Customer request'}`
  };

  const message = messages[status] || `Delivery Update: ${status}\n\nTracking: ${trackingNumber}`;
  
  return await sendWhatsAppMessage(phone, message);
};

/**
 * Send driver notification
 * @param {string} phone - Driver phone number
 * @param {string} trackingNumber - Tracking number
 * @param {Object} deliveryDetails - Delivery details
 */
const sendDriverNotification = async (phone, trackingNumber, deliveryDetails) => {
  const message = `🚚 *New Delivery Assignment*\n\nTracking: ${trackingNumber}\n\nPickup:\n${deliveryDetails.pickupAddress}\n\nDeliver to:\n${deliveryDetails.deliveryAddress}\n\nCustomer: ${deliveryDetails.customerName}\nPhone: ${deliveryDetails.customerPhone}\n\nPackage: ${deliveryDetails.packageDescription}\n\nPlease accept or reject this delivery in the app.`;
  
  return await sendWhatsAppMessage(phone, message);
};

module.exports = {
  sendWhatsAppMessage,
  sendDeliveryUpdate,
  sendDriverNotification,
  formatPhoneNumber
};