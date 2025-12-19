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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage deliveries, drivers, and system operations</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📦</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats?.deliveries?.statusBreakdown?.reduce((acc, s) => acc + s.count, 0) || 0}
                </p>
                <p className="text-sm text-gray-400">Total Deliveries</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"></div>
          </motion.div>

          {/* Active Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🚚</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {getStatusCount('in_transit') + getStatusCount('out_for_delivery')}
                </p>
                <p className="text-sm text-gray-400">Active Deliveries</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"></div>
          </motion.div>

          {/* Available Drivers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👤</div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">
                  {stats?.users?.availableDrivers || 0}
                </p>
                <p className="text-sm text-gray-400">Available Drivers</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-neon-green to-emerald-500 rounded-full"></div>
          </motion.div>

          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💰</div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats?.deliveries?.totalRevenue || 0)}
                </p>
                <p className="text-sm text-gray-400">Total Revenue</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <Link to="/admin/deliveries/new" className="btn-primary">
            ➕ Create Delivery
          </Link>
          <Link to="/admin/deliveries" className="btn-secondary">
            📋 All Deliveries
          </Link>
          <Link to="/admin/users" className="btn-secondary">
            👥 Manage Users
          </Link>
          <Link to="/admin/drivers" className="btn-secondary">
            🚚 Manage Drivers
          </Link>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === ''
                  ? 'bg-neon-blue text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              All ({stats?.deliveries?.statusBreakdown?.reduce((acc, s) => acc + s.count, 0) || 0})
            </button>
            {DELIVERY_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status.value
                    ? 'bg-neon-blue text-white'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                {status.icon} {status.label} ({getStatusCount(status.value)})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Deliveries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Deliveries</h3>
            <button onClick={refresh} className="text-neon-blue hover:text-neon-cyan transition-colors">
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : deliveries.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No deliveries found"
              message={filter ? `No deliveries with status "${filter}"` : "No deliveries created yet"}
              action={
                <Link to="/admin/deliveries/new" className="btn-primary">
                  Create First Delivery
                </Link>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Tracking #</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Driver</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
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
                        <td className="py-4 px-4">
                          <Link
                            to={`/admin/deliveries/${delivery._id}`}
                            className="text-neon-blue hover:text-neon-cyan font-mono"
                          >
                            {delivery.trackingNumber}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{delivery.customerName}</td>
                        <td className="py-4 px-4 text-gray-300">
                          {delivery.driver?.name || (
                            <span className="text-gray-500 italic">Not assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={delivery.status} />
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {formatDate(delivery.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-gray-300 font-semibold">
                          {formatCurrency(delivery.price)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            to={`/admin/deliveries/${delivery._id}`}
                            className="text-neon-blue hover:text-neon-cyan text-sm"
                          >
                            View →
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Showing {deliveries.length} of {pagination.total} deliveries
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-lg ${
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