import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPKR } from '../utils/helpers';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getShipping, getTax, getGrandTotal } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
        <Link to="/shop" className="inline-block bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-semibold transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 flex gap-4">
              <Link to={`/product/${item._id}`} className="flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/200x200/f3f4f6/999?text=Item'; }} />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-accent transition text-sm md:text-base truncate">{item.name}</Link>
                  <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0 p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <p className="text-accent font-bold mt-1">{formatPKR(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <span className="font-bold text-gray-800">{formatPKR(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPKR(getTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={getShipping() === 0 ? 'text-success font-medium' : ''}>
                  {getShipping() === 0 ? 'FREE' : formatPKR(getShipping())}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>{formatPKR(getTax())}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-accent">{formatPKR(getGrandTotal())}</span>
              </div>
            </div>
            {getShipping() > 0 && (
              <p className="text-xs text-success mt-3 bg-success/10 p-2 rounded-lg">
                Add {formatPKR(5000 - getTotal())} more for free shipping!
              </p>
            )}
            {user ? (
              <Link to="/checkout" className="block w-full bg-accent hover:bg-accent-light text-white text-center py-3.5 rounded-xl font-semibold mt-6 transition shadow-lg shadow-accent/20">
                Proceed to Checkout
              </Link>
            ) : (
              <Link to="/login?redirect=checkout" className="block w-full bg-primary hover:bg-secondary text-white text-center py-3.5 rounded-xl font-semibold mt-6 transition">
                Login to Checkout
              </Link>
            )}
            <Link to="/shop" className="block text-center text-accent hover:text-accent-light text-sm mt-3 font-medium transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
