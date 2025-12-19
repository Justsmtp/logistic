/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import DeliveryMap from '../components/DeliveryMap';
import { useTrackDelivery } from '../hooks/useDeliveries';
import { formatDate, formatCurrency, getDeliveryProgress } from '../utils/helpers';

const TrackDelivery = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [submittedNumber, setSubmittedNumber] = useState(searchParams.get('number') || '');
  const { delivery, loading, error } = useTrackDelivery(submittedNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedNumber(trackingNumber.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid">
      {/* Header */}
      <div className="glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🚚
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">LogiTrack</h1>
              <p className="text-xs text-gray-500">Track Your Delivery</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tracking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Track Your Package</h2>
          <p className="text-gray-400 mb-6">
            Enter your tracking number to see real-time delivery status
          </p>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="Enter tracking number (e.g., TRK123ABC456)"
              className="input-field flex-1 font-mono"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              🔍 Track
            </button>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12"
          >
            <LoadingSpinner message="Tracking your package..." />
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-white mb-2">Tracking Number Not Found</h3>
            <p className="text-gray-400 mb-6">
              The tracking number you entered could not be found. Please check and try again.
            </p>
          </motion.div>
        )}

        {/* Delivery Info */}
        {delivery && !loading && (
          <>
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Tracking Number</p>
                  <h3 className="text-2xl font-bold text-neon-blue font-mono">
                    {delivery.trackingNumber}
                  </h3>
                </div>
                <StatusBadge status={delivery.status} className="text-lg px-6 py-3" />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-400">Delivery Progress</p>
                  <p className="text-neon-blue font-bold text-lg">
                    {getDeliveryProgress(delivery.status)}%
                  </p>
                </div>
                <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getDeliveryProgress(delivery.status)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan animate-glow"
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">📍 Pickup Location</p>
                  <p className="text-white font-medium">
                    {delivery.pickupAddress.address}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {delivery.pickupAddress.city}, {delivery.pickupAddress.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">📍 Delivery Location</p>
                  <p className="text-white font-medium">
                    {delivery.deliveryAddress.address}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">📦 Package</p>
                  <p className="text-white">{delivery.packageDetails.description}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">💰 Delivery Fee</p>
                  <p className="text-white font-semibold text-lg">
                    {formatCurrency(delivery.price)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Driver Info */}
            {delivery.driver && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">🚚 Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-medium">{delivery.driver.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Vehicle</p>
                    <p className="text-white capitalize">
                      {delivery.driver.vehicleType} - {delivery.driver.vehicleNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Rating</p>
                    <p className="text-white">⭐ {delivery.driver.rating?.toFixed(1) || '5.0'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">📍 Live Location</h3>
              <DeliveryMap delivery={delivery} />
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">📋 Delivery Timeline</h3>
              <div className="space-y-4">
                {delivery.timeline?.slice().reverse().map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-neon-blue"></div>
                      {index < delivery.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-neon-blue/30 my-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <StatusBadge status={event.status} className="mb-2" />
                      <p className="text-white">{event.note || 'Status updated'}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Proof of Delivery */}
            {delivery.proofOfDelivery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8 mt-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">✅ Proof of Delivery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={delivery.proofOfDelivery.photo?.url}
                      alt="Proof of delivery"
                      className="w-full rounded-xl border border-white/10"
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Received By</p>
                      <p className="text-white font-medium">
                        {delivery.proofOfDelivery.receivedBy}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Delivery Time</p>
                      <p className="text-white">
                        {formatDate(delivery.proofOfDelivery.timestamp)}
                      </p>
                    </div>
                    {delivery.proofOfDelivery.notes && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Notes</p>
                        <p className="text-white">{delivery.proofOfDelivery.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/login" className="text-neon-blue hover:text-neon-cyan transition-colors">
            Sign in to your account →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackDelivery;