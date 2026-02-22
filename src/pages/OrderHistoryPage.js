//src/pages/OrderHistoryPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orders';
import { useTranslation } from 'react-i18next';
import { generateReceiptPDF } from '../utils/receiptGenerator';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadReceipt = (order) => {
    // Assuming order contains all necessary data
    generateReceiptPDF(order);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('nav.orders')}</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {t('order.number')}{order.order_number}
                  </h2>
                  <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                  {t(`order.status.${order.status}`)}
                </span>
              </div>
              <div className="mb-4">
                <p>Total: ${parseFloat(order.total_amount).toFixed(2)} {order.currency}</p>
                <p>Items: {order.items.length}</p>
              </div>
              <div className="flex gap-4">
                <Link to={`/order/${order.id}`} className="text-blue-600 hover:underline">
                View Details
                </Link>
                {order.status === 'PAID' && (
                  <button
                    onClick={() => handleDownloadReceipt(order)}
                    className="text-green-600 hover:underline"
                  >
                    {t('order.downloadReceipt')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;