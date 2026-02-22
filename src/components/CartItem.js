//src/components/CartItem.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();
  const { t, i18n } = useTranslation();
  const product = item.product;
  const name = product[`name_${i18n.language}`] || product.name_en;

  return (
    <div className="flex items-center border-b py-4">
      <img src={product.images?.[0]?.file_path || '/placeholder.jpg'} alt={name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1 ml-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">${product.price_usd} each</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => updateQty(product.id, item.qty - 1)}
          className="px-2 py-1 bg-gray-200 rounded-l"
        >-</button>
        <span className="px-4 py-1 border-t border-b">{item.qty}</span>
        <button
          onClick={() => updateQty(product.id, item.qty + 1)}
          className="px-2 py-1 bg-gray-200 rounded-r"
        >+</button>
      </div>
      <div className="ml-4 w-24 text-right font-semibold">
        ${(product.price_usd * item.qty).toFixed(2)}
      </div>
      <button
        onClick={() => removeFromCart(product.id)}
        className="ml-4 text-red-600"
      >
        {t('cart.remove')}
      </button>
    </div>
  );
};

export default CartItem;