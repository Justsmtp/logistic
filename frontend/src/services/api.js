import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user details
  updateDetails: async (data) => {
    const response = await api.put('/auth/updatedetails', data);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Update password
  updatePassword: async (passwords) => {
    const response = await api.put('/auth/updatepassword', passwords);
    return response.data;
  },

  // Update driver location
  updateLocation: async (location) => {
    const response = await api.put('/auth/location', location);
    return response.data;
  },

  // Toggle driver availability
  toggleAvailability: async () => {
    const response = await api.put('/auth/availability');
    return response.data;
  },
};

// ==================== DELIVERY SERVICES ====================

export const deliveryService = {
  // Create new delivery
  createDelivery: async (deliveryData) => {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  },

  // Get all deliveries
  getDeliveries: async (params = {}) => {
    const response = await api.get('/deliveries', { params });
    return response.data;
  },

  // Get single delivery
  getDelivery: async (id) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },

  // Track delivery by tracking number
  trackDelivery: async (trackingNumber) => {
    const response = await api.get(`/deliveries/track/${trackingNumber}`);
    return response.data;
  },

  // Assign driver to delivery
  assignDriver: async (deliveryId, driverId) => {
    const response = await api.put(`/deliveries/${deliveryId}/assign`, { driverId });
    return response.data;
  },

  // Update delivery status
  updateStatus: async (deliveryId, statusData) => {
    const response = await api.put(`/deliveries/${deliveryId}/status`, statusData);
    return response.data;
  },

  // Upload proof of delivery
  uploadProof: async (deliveryId, formData) => {
    const response = await api.post(`/deliveries/${deliveryId}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete delivery
  deleteDelivery: async (id) => {
    const response = await api.delete(`/deliveries/${id}`);
    return response.data;
  },

  // Get delivery statistics
  getStats: async () => {
    const response = await api.get('/deliveries/stats/summary');
    return response.data;
  },
};

// ==================== USER SERVICES ====================

export const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get available drivers
  getAvailableDrivers: async () => {
    const response = await api.get('/users/drivers/available');
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default api;