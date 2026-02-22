//src/pages/OrderDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrder } from '../services/orders';
import { generateReceiptPDF } from '../utils/receiptGenerator';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getMyOrder(orderId)
      .then(setOrder)
      .catch(err => {
        toast.error('Order not found');
        navigate('/orders');
      })
      .finally(() => setLoading(false));
  }, [orderId, user, navigate]);

  const handleDownloadReceipt = () => {
    generateReceiptPDF(order, user);
  };

  const statusColors = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    WAITING_VERIFY: 'bg-orange-100 text-orange-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800'
  };

  if (loading) return <div className="text-center py-8">Loading order...</div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-blue-600 hover:underline">&larr; Back to Orders</Link>
      </div>
      <div className="border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {t(`order.status.${order.status}`)}
          </span>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Customer Information</h2>
          <p>Name: {order.customer_name}</p>
          <p>Phone: {order.customer_phone}</p>
          <p>Address: {order.customer_address}</p>
          {order.note && <p>Note: {order.note}</p>}
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Items</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-left">Qty</th>
                <th className="border p-2 text-left">Unit Price</th>
                <th className="border p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.product_name_snapshot}</td>
                  <td className="border p-2">{item.qty}</td>
                  <td className="border p-2">${parseFloat(item.unit_price).toFixed(2)}</td>
                  <td className="border p-2">${parseFloat(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${parseFloat(order.shipping_fee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${parseFloat(order.total_amount).toFixed(2)} ({order.currency})</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'PAID' && (
          <button
            onClick={handleDownloadReceipt}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {t('order.downloadReceipt')}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;