const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDeliveries,
  getDelivery,
  trackDelivery,
  assignDriver,
  updateStatus,
  uploadProof,
  deleteDelivery,
  getStats
} = require('../controllers/deliveryController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/track/:trackingNumber', trackDelivery);

// Protected routes
router.post('/', protect, authorize('admin', 'customer'), createDelivery);
router.get('/', protect, getDeliveries);
router.get('/stats/summary', protect, authorize('admin', 'driver'), getStats);
router.get('/:id', protect, getDelivery);

// Admin only routes
router.put('/:id/assign', protect, authorize('admin'), assignDriver);
router.delete('/:id', protect, authorize('admin'), deleteDelivery);

// Driver/Admin routes
router.put('/:id/status', protect, authorize('driver', 'admin'), updateStatus);
router.post('/:id/proof', protect, authorize('driver'), upload.single('photo'), uploadProof);

module.exports = router;