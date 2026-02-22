//src/components/OrderSummary.js (for checkout)
import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderSummary = ({ items, subtotal, shipping, tax, total }) => {
  const { t } = useTranslation();
  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm mb-2">
          <span>{item.product.name_en} x {item.qty}</span>
          <span>${(item.product.price_usd * item.qty).toFixed(2)}</span>
        </div>
      ))}
      <hr className="my-2" />
      <div className="flex justify-between">
        <span>{t('cart.subtotal')}</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;