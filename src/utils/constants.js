//src/utils/constants.js
// API base URL – can be overridden by environment variable
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Order statuses mapping
export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'Pending Payment',
  WAITING_VERIFY: 'Waiting Verification',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled'
};

// Payment methods
export const PAYMENT_METHODS = {
  KHQR: 'KHQR',
  BCEL_ONE: 'BCEL One'
};

// Currencies
export const CURRENCIES = ['USD', 'KHR', 'LAK'];

// File upload limits
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];