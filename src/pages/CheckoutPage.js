//src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orders';
import { getPaymentMethods, uploadPaymentProof } from '../services/payments';
import OrderSummary from '../components/OrderSummary';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    address: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [methodsError, setMethodsError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const methods = await getPaymentMethods();
      console.log('Payment methods received:', methods); // Debug log
      setPaymentMethods(methods);
      setMethodsError(null);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      setMethodsError('Failed to load payment methods. Please try again.');
      toast.error('Could not load payment methods');
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        e.target.value = null;
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = null;
        return;
      }
      
      setProofFile(file);
    }
  };

  const handleImageError = (methodId) => {
    console.log(`Image failed to load for method ${methodId}`);
    setImageErrors(prev => ({ ...prev, [methodId]: true }));
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!customerInfo.address.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return false;
    }
    if (!proofFile) {
      toast.error('Please upload payment proof');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderData = {
        currency: 'USD',
        customer_name: customerInfo.name.trim(),
        customer_phone: customerInfo.phone.trim(),
        customer_address: customerInfo.address.trim(),
        items: cartItems.map(item => ({
          product_id: item.product.id,
          qty: item.qty
        }))
      };
      
      const order = await createOrder(orderData);
      
      // Upload payment proof
      await uploadPaymentProof(order.id, selectedMethod, proofFile);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders', { replace: true });
    } catch (error) {
      console.error('Order submission error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Order failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/products')} 
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 5.0 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Customer Information Section */}
          <div className="border p-6 rounded-lg mb-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t('checkout.customerInfo')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">{t('checkout.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">{t('checkout.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">{t('checkout.address')}</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter your delivery address"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="border p-6 rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t('checkout.paymentMethod')}</h2>
            
            {loadingMethods ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : methodsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{methodsError}</p>
                <button
                  type="button"
                  onClick={fetchPaymentMethods}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : paymentMethods.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No payment methods available</p>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method, index) => {
                  const methodId = method.id || method.method || index;
                  
                  return (
                    <div 
                      key={methodId}
                      className={`border rounded-lg p-4 transition ${
                        selectedMethod === method.method 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-400'
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.method}
                          checked={selectedMethod === method.method}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="mr-3 w-4 h-4 text-blue-600"
                        />
                        <span className="font-semibold text-lg">{method.method}</span>
                      </label>
                      
                      {method.qr_image_url && !imageErrors[methodId] && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Scan QR code to pay:</p>
                          <img 
                            src={method.qr_image_url} 
                            alt={`${method.method} QR code`}
                            className="w-48 h-48 object-contain border rounded-lg p-2 bg-white"
                            onError={() => handleImageError(methodId)}
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {imageErrors[methodId] && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            QR code image not available
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Please refer to the payment instructions below
                          </p>
                        </div>
                      )}
                      
                      {method.description && (
                        <div className="mt-3 text-sm text-gray-600">
                          <p className="font-medium mb-1">Instructions:</p>
                          <p>{method.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Payment Proof Upload */}
            <div className="mt-6 pt-6 border-t">
              <label className="block mb-2 font-medium">
                {t('checkout.uploadProof')}
                <span className="text-sm text-gray-500 ml-2">(Max 5MB, Image files only)</span>
              </label>
              
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    transition cursor-pointer"
                />
              </div>
              
              {proofFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Selected: {proofFile.name} ({(proofFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
            
            <button
              type="submit"
              disabled={loading || loadingMethods || paymentMethods.length === 0}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Placing Order...</span>
                </>
              ) : (
                t('checkout.placeOrder')
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;