//src/services/payments.js
import api from './api';

export const getPaymentMethods = async () => {
  const response = await api.get('/payments/methods');
  
  // Force the correct base URL
  const baseURL = 'http://localhost:8000';
  
  // Transform each payment method's QR image URL to use the correct path
  return response.data.map(method => {
    // Extract just the filename from the URL if it contains uploads
    let qrImageUrl = method.qr_image_url;
    
    console.log('Original QR URL from backend:', qrImageUrl);
    
    // If the URL contains 'uploads', remove it
    if (qrImageUrl && qrImageUrl.includes('/uploads/')) {
      // Replace /uploads/ with / 
      qrImageUrl = qrImageUrl.replace('/uploads/', '/');
      console.log('Fixed URL (removed uploads):', qrImageUrl);
    }
    
    // If it's a relative path, make it absolute with the correct base
    if (qrImageUrl && !qrImageUrl.startsWith('http')) {
      // Make sure we have the correct path: /files/payment_methods/filename.jpg
      // Extract just the filename if needed
      const filename = qrImageUrl.split('/').pop();
      qrImageUrl = `${baseURL}/files/payment_methods/${filename}`;
      console.log('Constructed correct URL:', qrImageUrl);
    }
    
    return {
      ...method,
      qr_image_url: qrImageUrl
    };
  });
};

export const uploadPaymentProof = async (orderId, method, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/payments/orders/${orderId}/proof?method=${method}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getOrderPaymentProofs = async (orderId) => {
  const response = await api.get(`/payments/orders/${orderId}/proofs`);
  return response.data;
};