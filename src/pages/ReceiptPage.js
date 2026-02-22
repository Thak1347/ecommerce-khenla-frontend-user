//src/pages/ReceiptPage.js (optional, for viewing receipt)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrder } from '../services/orders';
import ReceiptTemplate from '../components/ReceiptTemplate';
import toast from 'react-hot-toast';

const ReceiptPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) return <div className="text-center py-8">Loading receipt...</div>;
  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ReceiptTemplate order={order} user={user} />
    </div>
  );
};

export default ReceiptPage;