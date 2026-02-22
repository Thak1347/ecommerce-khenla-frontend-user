//src/components/ReceiptTemplate.js (for PDF generation)
import React from 'react';
import { generateReceiptPDF } from '../utils/receiptGenerator';

const ReceiptTemplate = ({ order, user }) => {
  const handleDownloadPDF = () => {
    generateReceiptPDF(order, user);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 border rounded-lg shadow print:shadow-none print:border-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">KHENLA</h1>
        <p className="text-gray-600">Computer Products Store</p>
      </div>

      {/* Receipt Details */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600">Receipt #: {order.order_number}</p>
          <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Order #: {order.order_number}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Customer Information</h2>
        <p>Name: {order.customer_name}</p>
        <p>Phone: {order.customer_phone}</p>
        <p>Address: {order.customer_address}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Item</th>
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
            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment & Footer */}
      <div className="text-sm text-gray-600 mb-4">
        <p>Payment Method: {order.payment_method || 'N/A'}</p>
        <p>Seller: PITHAK CHHORN</p>
      </div>
      <p className="text-center text-gray-600 italic">Thank you for your purchase!</p>

      {/* Print/Download Buttons (hidden when printing) */}
      <div className="flex justify-center gap-4 mt-8 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default ReceiptTemplate;