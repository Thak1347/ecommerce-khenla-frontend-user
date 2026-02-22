import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReceiptPDF = (order, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text('KHENLA', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Receipt', pageWidth / 2, 30, { align: 'center' });

  // Receipt info
  doc.setFontSize(10);
  doc.text(`Receipt #: ${order.order_number}`, 14, 40);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 14, 46);
  doc.text(`Order #: ${order.order_number}`, 14, 52);

  // Customer info
  doc.text(`Customer: ${order.customer_name}`, 14, 62);
  doc.text(`Phone: ${order.customer_phone}`, 14, 68);
  doc.text(`Address: ${order.customer_address}`, 14, 74);

  // Items table
  const tableColumn = ['Item', 'Qty', 'Unit Price', 'Total'];
  const tableRows = order.items.map(item => [
    item.product_name_snapshot,
    item.qty,
    `$${parseFloat(item.unit_price).toFixed(2)}`,
    `$${parseFloat(item.line_total).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: $${parseFloat(order.subtotal).toFixed(2)}`, 14, finalY);
  doc.text(`Shipping: $${parseFloat(order.shipping_fee).toFixed(2)}`, 14, finalY + 6);
  doc.text(`Total: $${parseFloat(order.total_amount).toFixed(2)}`, 14, finalY + 12);

  // Payment method
  doc.text(`Payment Method: ${order.payment_method || 'N/A'}`, 14, finalY + 20);
  doc.text(`Seller: PITHAK CHHORN`, 14, finalY + 26);
  doc.text('Thank you for your purchase!', 14, finalY + 35);

  // Save PDF
  doc.save(`receipt-${order.order_number}.pdf`);
};