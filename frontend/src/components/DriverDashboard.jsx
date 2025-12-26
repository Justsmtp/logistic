/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useDeliveries } from '../hooks/useDeliveries';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDeliveryActions } from '../hooks/useDeliveries';
import { formatDate, formatCurrency } from '../utils/helpers';
import { deliveryService } from '../services/api';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
  const { user, updateLocation, toggleAvailability } = useAuth();
  const { location } = useGeolocation(true); // Watch location continuously
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('assigned');
  const { deliveries, loading, refresh } = useDeliveries(
    { status: activeFilter },
    false,
    0
  );
  const { updateStatus, actionLoading } = useDeliveryActions();

  // Update location when it changes
  useEffect(() => {
    if (location && user?.isAvailable) {
      updateLocation({
        longitude: location.longitude,
        latitude: location.latitude,
      });
    }
  }, [location, user?.isAvailable]);

  // Fetch driver statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await deliveryService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleToggleAvailability = async () => {
    await toggleAvailability();
    refresh();
  };

  const handleQuickStatusUpdate = async (deliveryId, newStatus) => {
    const result = await updateStatus(deliveryId, {
      status: newStatus,
      longitude: location?.longitude,
      latitude: location?.latitude,
    });

    if (result.success) {
      refresh();
    }
  };

  const getStatusCount = (status) => {
    return stats?.statusBreakdown?.find(s => s._id === status)?.count || 0;
  };

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid pb-20 md:pb-8">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Driver Dashboard</h1>
          <p className="text-gray-400">Manage your deliveries and availability</p>
        </motion.div>

        {/* Availability Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Availability Status</h3>
              <p className="text-gray-400 text-sm">
                {user?.isAvailable
                  ? '🟢 You are available for new deliveries'
                  : '🔴 You are currently unavailable'}
              </p>
            </div>
            <button
              onClick={handleToggleAvailability}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                user?.isAvailable
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {user?.isAvailable ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          {location && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                📍 Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                {' '} (Accuracy: {location.accuracy?.toFixed(0)}m)
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Completed Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 card-hover"
          >
            <div className="text-3xl md:text-4xl mb-2">✅</div>
            <p className="text-2xl md:text-3xl font-bold text-white">{user?.deliveriesCompleted || 0}</p>
            <p className="text-xs md:text-sm text-gray-400">Completed</p>
          </motion.div>

          {/* Active Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 md:p-6 card-hover"
          >
            <div className="text-3xl md:text-4xl mb-2">🚚</div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {getStatusCount('in_transit') + getStatusCount('out_for_delivery')}
            </p>
            <p className="text-xs md:text-sm text-gray-400">Active</p>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 md:p-6 card-hover"
          >
            <div className="text-3xl md:text-4xl mb-2">⭐</div>
            <p className="text-2xl md:text-3xl font-bold text-white">{user?.rating?.toFixed(1) || '5.0'}</p>
            <p className="text-xs md:text-sm text-gray-400">Rating</p>
          </motion.div>

          {/* Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-4 md:p-6 card-hover"
          >
            <div className="text-3xl md:text-4xl mb-2">💰</div>
            <p className="text-xl md:text-2xl font-bold text-white">
              {formatCurrency(stats?.totalRevenue || 0)}
            </p>
            <p className="text-xs md:text-sm text-gray-400">Earnings</p>
          </motion.div>
        </div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 md:p-6 mb-8"
        >
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4">My Deliveries</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm transition-all ${
                  activeFilter === status
                    ? 'bg-neon-blue text-white'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {loading ? (
            <LoadingSpinner />
          ) : deliveries.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No deliveries found"
              message={`You have no ${activeFilter.replace('_', ' ')} deliveries`}
            />
          ) : (
            deliveries.map((delivery, index) => (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 md:p-6 card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Link
                        to={`/driver/deliveries/${delivery._id}`}
                        className="text-lg font-bold text-neon-blue hover:text-neon-cyan font-mono"
                      >
                        {delivery.trackingNumber}
                      </Link>
                      <StatusBadge status={delivery.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">📍 Pickup</p>
                        <p className="text-white">
                          {delivery.pickupAddress.address}, {delivery.pickupAddress.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">📍 Delivery</p>
                        <p className="text-white">
                          {delivery.deliveryAddress.address}, {delivery.deliveryAddress.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">👤 Customer</p>
                        <p className="text-white">{delivery.customerName}</p>
                        <p className="text-gray-500 text-xs">{delivery.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">📦 Package</p>
                        <p className="text-white">{delivery.packageDetails.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex md:flex-col gap-2">
                    {delivery.status === 'assigned' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(delivery._id, 'picked_up')}
                        disabled={actionLoading}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        ✅ Pick Up
                      </button>
                    )}
                    {delivery.status === 'picked_up' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(delivery._id, 'in_transit')}
                        disabled={actionLoading}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        🚚 In Transit
                      </button>
                    )}
                    {delivery.status === 'in_transit' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(delivery._id, 'out_for_delivery')}
                        disabled={actionLoading}
                        className="btn-primary text-sm whitespace-nowrap"
                      >
                        📍 Near Destination
                      </button>
                    )}
                    <Link
                      to={`/driver/deliveries/${delivery._id}`}
                      className="btn-secondary text-sm whitespace-nowrap text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Mobile Quick Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 p-4 md:hidden">
        <button onClick={refresh} className="btn-primary w-full">
          🔄 Refresh Deliveries
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;