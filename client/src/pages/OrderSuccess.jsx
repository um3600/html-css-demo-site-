import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { formatPKR } from '../utils/helpers';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Order not found</h2>
        <Link to="/" className="text-accent hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-fade-in">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Thank you for your order. We will process it shortly.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold text-lg text-gray-800">{order.orderNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.province}</p>
            <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Payment</h3>
            <p className="text-sm text-gray-600">Method: {order.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Cash on Delivery'}</p>
            {order.paymentDetails?.transactionId && (
              <p className="text-sm text-gray-600">Transaction ID: {order.paymentDetails.transactionId}</p>
            )}
            <p className="text-sm text-gray-600">Status: <span className={order.paymentDetails?.status === 'completed' ? 'text-success font-medium' : 'text-yellow-600'}>{order.paymentDetails?.status || 'N/A'}</span></p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/100x100/f3f4f6/999?text=Item'; }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPKR(item.price)}</p>
              </div>
              <span className="text-sm font-medium">{formatPKR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPKR(order.shippingCost)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPKR(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total Paid</span><span className="text-accent">{formatPKR(order.totalAmount)}</span></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Link to="/shop" className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-semibold transition">Continue Shopping</Link>
        <Link to="/orders" className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition">View My Orders</Link>
      </div>
    </div>
  );
}
