/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import StatusBadge from './StatusBadge';
import { useDeliveries } from '../hooks/useDeliveries';
import { deliveryService, userService } from '../services/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import { DELIVERY_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('');
  const { deliveries, loading, pagination, refresh } = useDeliveries(
    { status: filter, limit: 10 },
    true,
    30000
  );
  const [drivers, setDrivers] = useState([]);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [deliveryStats, userStats] = await Promise.all([
          deliveryService.getStats(),
          userService.getUserStats(),
        ]);

        setStats({
          deliveries: deliveryStats.data,
          users: userStats.data,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await userService.getAvailableDrivers();
        if (response.success) {
          setDrivers(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const getStatusCount = (status) => {
    return stats?.deliveries?.statusBreakdown?.find(s => s._id === status)?.count || 0;
  };

  return (
    <div className="min-h-screen bg-dark-900 cyber-grid">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header - Executive Dashboard Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Operations Dashboard</h1>
          <p className="text-gray-400">Monitor and manage all logistics operations</p>
        </motion.div>

        {/* Stats Grid - Executive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-l-4 border-neon-blue hover:shadow-xl transition-all"
          >
            <p className="text-gray-400 text-sm font-medium mb-2">TOTAL SHIPMENTS</p>
            <p className="text-4xl font-bold text-white mb-1">
              {stats?.deliveries?.statusBreakdown?.reduce((acc, s) => acc + s.count, 0) || 0}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
              <span className="text-gray-500">All time</span>
            </div>
          </motion.div>

          {/* Active Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border-l-4 border-neon-cyan hover:shadow-xl transition-all"
          >
            <p className="text-gray-400 text-sm font-medium mb-2">IN TRANSIT</p>
            <p className="text-4xl font-bold text-white mb-1">
              {getStatusCount('in_transit') + getStatusCount('out_for_delivery')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              <span className="text-gray-500">Active now</span>
            </div>
          </motion.div>

          {/* Available Drivers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-l-4 border-neon-green hover:shadow-xl transition-all"
          >
            <p className="text-gray-400 text-sm font-medium mb-2">AVAILABLE DRIVERS</p>
            <p className="text-4xl font-bold text-white mb-1">
              {stats?.users?.availableDrivers || 0}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-green"></div>
              <span className="text-gray-500">Online</span>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all"
          >
            <p className="text-gray-400 text-sm font-medium mb-2">TOTAL REVENUE</p>
            <p className="text-3xl font-bold text-white mb-1">
              {formatCurrency(stats?.deliveries?.totalRevenue || 0)}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-500 font-medium">12.5% up</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Admin Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Link to="/admin/deliveries/new" className="btn-primary">
            Create Shipment
          </Link>
          <Link to="/admin/deliveries" className="btn-secondary">
            All Shipments
          </Link>
          <Link to="/admin/users" className="btn-secondary">
            Manage Users
          </Link>
          <Link to="/admin/drivers" className="btn-secondary">
            Driver Management
          </Link>
        </motion.div>

        {/* Status Filter - Professional Segmented Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-2 mb-8"
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('')}
              className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                filter === ''
                  ? 'bg-neon-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({stats?.deliveries?.statusBreakdown?.reduce((acc, s) => acc + s.count, 0) || 0})
            </button>
            {DELIVERY_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filter === status.value
                    ? 'bg-neon-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status.label} ({getStatusCount(status.value)})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deliveries Table - Enterprise Data Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Recent Shipments</h3>
              <button onClick={refresh} className="text-neon-blue hover:text-neon-cyan transition-colors text-sm font-medium">
                Refresh Data
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Shipments Found</h3>
              <p className="text-gray-400 mb-6">
                {filter ? `No deliveries with status "${filter}"` : "No shipments created yet"}
              </p>
              <Link to="/admin/deliveries/new" className="btn-primary inline-block">
                Create First Shipment
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Tracking</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Customer</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Driver</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Created</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Amount</th>
                      <th className="text-right py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery, index) => (
                      <motion.tr
                        key={delivery._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <Link
                            to={`/admin/deliveries/${delivery._id}`}
                            className="text-neon-blue hover:text-neon-cyan font-mono font-medium"
                          >
                            {delivery.trackingNumber}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-white">{delivery.customerName}</td>
                        <td className="py-4 px-6">
                          {delivery.driver?.name ? (
                            <span className="text-white">{delivery.driver.name}</span>
                          ) : (
                            <span className="text-gray-500 italic text-sm">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={delivery.status} />
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {formatDate(delivery.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-white font-semibold">
                          {formatCurrency(delivery.price)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/admin/deliveries/${delivery._id}`}
                            className="text-neon-blue hover:text-neon-cyan text-sm font-medium"
                          >
                            Manage
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Showing {deliveries.length} of {pagination.total} shipments
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === pagination.page
                            ? 'bg-neon-blue text-white'
                            : 'glass-card text-gray-400 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
