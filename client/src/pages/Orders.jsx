import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { formatPKR } from '../utils/helpers';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/shop" className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-semibold">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-gray-800">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  <span className="text-lg font-bold text-accent">{formatPKR(order.totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {order.items.map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border" onError={(e) => { e.target.src = 'https://placehold.co/100x100/f3f4f6/999?text=Item'; }} />
                ))}
                <span className="text-sm text-gray-500 flex-shrink-0">{order.items.length} item(s)</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">{order.paymentMethod === 'jazzcash' ? 'JazzCash' : 'Cash on Delivery'}</span>
                <Link to={`/order-success/${order._id}`} className="text-sm text-accent hover:text-accent-light font-medium transition">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
