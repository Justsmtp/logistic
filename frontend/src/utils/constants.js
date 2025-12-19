// Delivery statuses
export const DELIVERY_STATUSES = [
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'assigned', label: 'Assigned', icon: '👤' },
  { value: 'picked_up', label: 'Picked Up', icon: '📦' },
  { value: 'in_transit', label: 'In Transit', icon: '🚚' },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: '📍' },
  { value: 'delivered', label: 'Delivered', icon: '✅' },
  { value: 'failed', label: 'Failed', icon: '❌' },
  { value: 'cancelled', label: 'Cancelled', icon: '🚫' },
];

// Priority levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', icon: '⬇️' },
  { value: 'medium', label: 'Medium', icon: '➡️' },
  { value: 'high', label: 'High', icon: '⬆️' },
  { value: 'urgent', label: 'Urgent', icon: '🔥' },
];

// Package categories
export const PACKAGE_CATEGORIES = [
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'food', label: 'Food', icon: '🍕' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'furniture', label: 'Furniture', icon: '🪑' },
  { value: 'other', label: 'Other', icon: '📦' },
];

// Vehicle types
export const VEHICLE_TYPES = [
  { value: 'bike', label: 'Motorcycle', icon: '🏍️' },
  { value: 'van', label: 'Van', icon: '🚐' },
  { value: 'truck', label: 'Truck', icon: '🚚' },
];

// User roles
export const USER_ROLES = [
  { value: 'customer', label: 'Customer', icon: '👤' },
  { value: 'driver', label: 'Driver', icon: '🚚' },
  { value: 'admin', label: 'Administrator', icon: '👑' },
];

// Nigerian states (for address forms)
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

// Payment statuses
export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'refunded', label: 'Refunded', color: 'blue' },
];

// Map default center (Lagos, Nigeria)
export const DEFAULT_MAP_CENTER = {
  lat: 6.5244,
  lng: 3.3792
};

// Map zoom levels
export const MAP_ZOOM = {
  city: 12,
  street: 15,
  building: 18,
};

// Pagination defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  limitOptions: [10, 20, 50, 100],
};

// Time intervals for auto-refresh
export const REFRESH_INTERVALS = {
  deliveries: 30000, // 30 seconds
  location: 60000, // 1 minute
  stats: 300000, // 5 minutes
};

// File upload limits
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Nigerian phone number',
  password: 'Password must be at least 6 characters',
  passwordMatch: 'Passwords do not match',
  fileSize: 'File size must be less than 5MB',
  fileType: 'Only image files are allowed',
};