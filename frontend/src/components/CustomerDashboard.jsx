/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { useDeliveries } from '../hooks/useDeliveries';
import { formatDate, formatCurrency, getDeliveryProgress } from '../utils/helpers';
import { DELIVERY_STATUSES } from '../utils/constants';

const CustomerDashboard = () => {
  const [filter, setFilter] = useState('');
  const { deliveries, loading, pagination, refresh } = useDeliveries(
    { status: filter, limit: 20 },
    true,
    30000
  );

  const activeDeliveries = deliveries.filter(d => 
    ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(d.status)
  );

  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">My Deliveries</h1>
          <p className="text-gray-400">Track and manage your delivery orders</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🚚</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{activeDeliveries.length}</p>
                <p className="text-sm text-gray-400">Active</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"></div>
          </motion.div>

          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">✅</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{completedDeliveries.length}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-green to-emerald-500 rounded-full"></div>
          </motion.div>

          {/* Total Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📦</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{deliveries.length}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"></div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <Link to="/customer/deliveries/new" className="btn-primary">
            ➕ Request Delivery
          </Link>
          <Link to="/track" className="btn-secondary">
            📍 Track Package
          </Link>
          <button onClick={refresh} className="btn-secondary">
            🔄 Refresh
          </button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 md:p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === ''
                  ? 'bg-neon-blue text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              All ({deliveries.length})
            </button>
            {DELIVERY_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  filter === status.value
                    ? 'bg-neon-blue text-white'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                {status.icon} {status.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : deliveries.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No deliveries found"
              message="You haven't created any deliveries yet. Start by requesting your first delivery!"
              action={
                <Link to="/customer/deliveries/new" className="btn-primary">
                  Request First Delivery
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <motion.div
                  key={delivery._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4 md:p-6 card-hover"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/customer/deliveries/${delivery._id}`}
                        className="text-xl font-bold text-neon-blue hover:text-neon-cyan font-mono"
                      >
                        {delivery.trackingNumber}
                      </Link>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white text-sm">{formatDate(delivery.createdAt)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-400">Delivery Progress</p>
                      <p className="text-sm text-neon-blue font-semibold">
                        {getDeliveryProgress(delivery.status)}%
                      </p>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getDeliveryProgress(delivery.status)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">📍 From</p>
                      <p className="text-white text-sm">
                        {delivery.pickupAddress.city}, {delivery.pickupAddress.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">📍 To</p>
                      <p className="text-white text-sm">
                        {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">💰 Price</p>
                      <p className="text-white text-sm font-semibold">
                        {formatCurrency(delivery.price)}
                      </p>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-gray-400 text-sm mb-1">📦 Package</p>
                    <p className="text-white">{delivery.packageDetails.description}</p>
                  </div>

                  {/* Driver Info (if assigned) */}
                  {delivery.driver && (
                    <div className="border-t border-white/10 pt-4 mb-4">
                      <p className="text-gray-400 text-sm mb-2">🚚 Driver</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{delivery.driver.name}</p>
                          <p className="text-gray-500 text-sm">{delivery.driver.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Vehicle</p>
                          <p className="text-white capitalize">
                            {delivery.driver.vehicleType} - {delivery.driver.vehicleNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/customer/deliveries/${delivery._id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/track?number=${delivery.trackingNumber}`}
                      className="btn-secondary text-sm"
                    >
                      📍 Track Live
                    </Link>
                    {delivery.driver && (
                      <a
                        href={`tel:${delivery.driver.phone}`}
                        className="btn-secondary text-sm"
                      >
                        📞 Call Driver
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;