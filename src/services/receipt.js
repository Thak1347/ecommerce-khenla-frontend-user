//src/services/receipt.js
import api from './api';

export const downloadReceipt = async (orderId) => {
  // The backend returns a PDF file
  const response = await api.get(`/receipts/orders/${orderId}`, {
    responseType: 'blob'
  });
  return response.data;
};