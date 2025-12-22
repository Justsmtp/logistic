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
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header - Professional Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Shipments</h1>
          <p className="text-gray-400">Track and manage all your delivery orders</p>
        </motion.div>

        {/* Stats Cards - Clean Enterprise Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Deliveries Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-l-4 border-neon-blue hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Active Shipments</p>
                <p className="text-3xl font-bold text-white">{activeDeliveries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-neon-blue rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          </motion.div>

          {/* Completed Deliveries Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border-l-4 border-neon-green hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-white">{completedDeliveries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Total Deliveries Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-l-4 border-neon-purple hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Shipments</p>
                <p className="text-3xl font-bold text-white">{deliveries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Professional Button Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Link to="/customer/deliveries/new" className="btn-primary">
            Request Delivery
          </Link>
          <Link to="/track" className="btn-secondary">
            Track Package
          </Link>
          <button onClick={refresh} className="btn-secondary">
            Refresh
          </button>
        </motion.div>

        {/* Filter Tabs - Segmented Control Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-2 mb-8 inline-flex rounded-xl"
        >
          <button
            onClick={() => setFilter('')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              filter === ''
                ? 'bg-neon-blue text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({deliveries.length})
          </button>
          {DELIVERY_STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm ${
                filter === status.value
                  ? 'bg-neon-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status.label}
            </button>
          ))}
        </motion.div>

        {/* Deliveries List - Professional Shipment Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Shipments Found</h3>
                <p className="text-gray-400 mb-6">
                  You haven't created any deliveries yet. Start by requesting your first shipment.
                </p>
                <Link to="/customer/deliveries/new" className="btn-primary inline-block">
                  Request First Delivery
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <motion.div
                  key={delivery._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card hover:shadow-xl transition-all"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/customer/deliveries/${delivery._id}`}
                          className="text-xl font-bold text-neon-blue hover:text-neon-cyan font-mono"
                        >
                          {delivery.trackingNumber}
                        </Link>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-white">{formatDate(delivery.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar - Clean Design */}
                  <div className="px-6 py-4 bg-dark-800/30">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-400 font-medium">Shipment Progress</p>
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

                  {/* Card Body - Structured Grid Layout */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Route Information */}
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-2">ORIGIN</p>
                        <p className="text-white font-medium">{delivery.pickupAddress.city}</p>
                        <p className="text-gray-400 text-sm">{delivery.pickupAddress.state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-2">DESTINATION</p>
                        <p className="text-white font-medium">{delivery.deliveryAddress.city}</p>
                        <p className="text-gray-400 text-sm">{delivery.deliveryAddress.state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-2">SHIPPING COST</p>
                        <p className="text-white text-lg font-bold">
                          {formatCurrency(delivery.price)}
                        </p>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="border-t border-white/5 pt-4 mb-6">
                      <p className="text-xs text-gray-500 font-medium mb-2">PACKAGE DETAILS</p>
                      <p className="text-white">{delivery.packageDetails.description}</p>
                    </div>

                    {/* Driver Information - Compact Panel */}
                    {delivery.driver && (
                      <div className="border-t border-white/5 pt-4 mb-6">
                        <p className="text-xs text-gray-500 font-medium mb-3">ASSIGNED DRIVER</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{delivery.driver.name}</p>
                            <p className="text-gray-400 text-sm">{delivery.driver.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Vehicle</p>
                            <p className="text-white capitalize">
                              {delivery.driver.vehicleType} • {delivery.driver.vehicleNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/customer/deliveries/${delivery._id}`}
                        className="btn-primary text-sm flex-1 md:flex-none"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/track?number=${delivery.trackingNumber}`}
                        className="btn-secondary text-sm flex-1 md:flex-none"
                      >
                        Track Live
                      </Link>
                      {delivery.driver && (
                        <a
                          href={`tel:${delivery.driver.phone}`}
                          className="btn-secondary text-sm flex-1 md:flex-none"
                        >
                          Call Driver
                        </a>
                      )}
                    </div>
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