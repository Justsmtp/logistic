import { useState, useEffect, useCallback } from 'react';
import { deliveryService } from '../services/api';
import toast from 'react-hot-toast';

export const useDeliveries = (filters = {}, autoRefresh = false, refreshInterval = 30000) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    count: 0,
  });

  // Fetch deliveries
  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deliveryService.getDeliveries(filters);
      
      if (response.success) {
        setDeliveries(response.data);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total,
          count: response.count,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch deliveries';
      setError(errorMessage);
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDeliveries();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchDeliveries]);

  // Refresh deliveries
  const refresh = () => {
    fetchDeliveries();
  };

  return {
    deliveries,
    loading,
    error,
    pagination,
    refresh,
  };
};

// Hook for single delivery
export const useDelivery = (deliveryId) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDelivery = useCallback(async () => {
    if (!deliveryId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await deliveryService.getDelivery(deliveryId);
      
      if (response.success) {
        setDelivery(response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch delivery';
      setError(errorMessage);
      console.error('Error fetching delivery:', err);
    } finally {
      setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  const refresh = () => {
    fetchDelivery();
  };

  return {
    delivery,
    loading,
    error,
    refresh,
  };
};

// Hook for delivery tracking
export const useTrackDelivery = (trackingNumber) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trackDelivery = useCallback(async () => {
    if (!trackingNumber) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await deliveryService.trackDelivery(trackingNumber);
      
      if (response.success) {
        setDelivery(response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid tracking number';
      setError(errorMessage);
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  }, [trackingNumber]);

  useEffect(() => {
    trackDelivery();
  }, [trackDelivery]);

  const refresh = () => {
    trackDelivery();
  };

  return {
    delivery,
    loading,
    error,
    refresh,
  };
};

// Hook for delivery actions
export const useDeliveryActions = () => {
  const [actionLoading, setActionLoading] = useState(false);

  const createDelivery = async (deliveryData) => {
    try {
      setActionLoading(true);
      const response = await deliveryService.createDelivery(deliveryData);
      
      if (response.success) {
        toast.success('Delivery created successfully!');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create delivery';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const assignDriver = async (deliveryId, driverId) => {
    try {
      setActionLoading(true);
      const response = await deliveryService.assignDriver(deliveryId, driverId);
      
      if (response.success) {
        toast.success('Driver assigned successfully!');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to assign driver';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatus = async (deliveryId, statusData) => {
    try {
      setActionLoading(true);
      const response = await deliveryService.updateStatus(deliveryId, statusData);
      
      if (response.success) {
        toast.success('Status updated successfully!');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const uploadProof = async (deliveryId, formData) => {
    try {
      setActionLoading(true);
      const response = await deliveryService.uploadProof(deliveryId, formData);
      
      if (response.success) {
        toast.success('Proof uploaded successfully!');
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload proof';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDelivery = async (deliveryId) => {
    try {
      setActionLoading(true);
      const response = await deliveryService.deleteDelivery(deliveryId);
      
      if (response.success) {
        toast.success('Delivery deleted successfully!');
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete delivery';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    createDelivery,
    assignDriver,
    updateStatus,
    uploadProof,
    deleteDelivery,
    actionLoading,
  };
};