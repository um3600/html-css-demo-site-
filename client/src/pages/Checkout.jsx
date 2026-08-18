import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { formatPKR } from '../utils/helpers';

export default function Checkout() {
  const { items, getTotal, getShipping, getTax, getGrandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '',
    notes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.phone || !form.street || !form.city) {
      setError('Please fill all required fields');
      return;
    }

    if (paymentMethod === 'jazzcash' && !jazzcashNumber) {
      setError('Please enter your JazzCash account number');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode
        },
        paymentMethod,
        accountNumber: jazzcashNumber,
        notes: form.notes
      };

      const { data } = await orderAPI.create(orderData);
      clearCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">No items to checkout</h2>
        <Link to="/shop" className="text-accent hover:underline">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>

      <div className="flex items-center gap-4 mb-8">
        {['Shipping', 'Payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? 'bg-success text-white' : step === i + 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </span>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
            {i < 1 && <div className="w-12 h-px bg-gray-200"></div>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleOrder}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="03XX XXXXXXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                    <input type="text" name="street" value={form.street} onChange={handleChange} placeholder="House #, Street, Area" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <select name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm bg-white">
                      <option>Lahore</option>
                      <option>Karachi</option>
                      <option>Islamabad</option>
                      <option>Rawalpindi</option>
                      <option>Faisalabad</option>
                      <option>Multan</option>
                      <option>Peshawar</option>
                      <option>Quetta</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                    <select name="province" value={form.province} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm bg-white">
                      <option>Punjab</option>
                      <option>Sindh</option>
                      <option>KPK</option>
                      <option>Balochistan</option>
                      <option>Islamabad Capital</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm resize-none" placeholder="Special delivery instructions..."></textarea>
                  </div>
                </div>
                <button type="button" onClick={() => { if (form.fullName && form.phone && form.street && form.city) { setStep(2); setError(''); } else { setError('Please fill all required fields'); }}} className="mt-6 bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-semibold transition">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === 'jazzcash' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-accent" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">JC</div>
                      <div>
                        <p className="font-semibold text-gray-800">JazzCash</p>
                        <p className="text-xs text-gray-500">Pay with your JazzCash mobile account</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-accent" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">COD</div>
                      <div>
                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'jazzcash' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <span className="font-bold text-green-800">JazzCash Payment</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-1">JazzCash Account Number *</label>
                        <input
                          type="tel"
                          value={jazzcashNumber}
                          onChange={(e) => setJazzcashNumber(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 text-sm bg-white"
                        />
                      </div>
                      <p className="text-xs text-green-700">
                        You will receive a confirmation prompt on your phone. Enter your MPIN to complete payment of {formatPKR(getGrandTotal())}.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-accent hover:bg-accent-light text-white py-3.5 rounded-xl font-semibold transition shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </>
                    ) : (
                      `Place Order - ${formatPKR(getGrandTotal())}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/100x100/f3f4f6/999?text=Item'; }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-800 flex-shrink-0">{formatPKR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPKR(getTotal())}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={getShipping() === 0 ? 'text-success font-medium' : ''}>{getShipping() === 0 ? 'FREE' : formatPKR(getShipping())}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span>{formatPKR(getTax())}</span></div>
                <hr />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-accent">{formatPKR(getGrandTotal())}</span></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
