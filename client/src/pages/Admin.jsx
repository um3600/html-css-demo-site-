import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI, productAPI, authAPI } from '../utils/api';
import { formatPKR } from '../utils/helpers';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: 'Men', image: '', stock: '', featured: false, onSale: false });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        orderAPI.getDashboard(),
        orderAPI.getAll({ limit: 50 }),
        productAPI.getAll({ limit: 100 }),
        authAPI.getAllUsers()
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
      setUsers(usersRes.data.users);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (e) { alert('Failed to update'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...productForm, price: Number(productForm.price), originalPrice: Number(productForm.originalPrice), stock: Number(productForm.stock) };
      if (editingProduct) {
        const { data: res } = await productAPI.update(editingProduct._id, data);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.product : p));
      } else {
        const { data: res } = await productAPI.create(data);
        setProducts(prev => [res.product, ...prev]);
      }
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', originalPrice: '', category: 'Men', image: '', stock: '', featured: false, onSale: false });
    } catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (e) { alert('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await authAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) { alert('Failed'); }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        <button onClick={loadData} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition">Refresh</button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['dashboard', 'orders', 'products', 'users'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Revenue', value: formatPKR(stats.totalRevenue), color: 'text-success', bg: 'bg-green-50' },
              { label: 'Pending', value: stats.pendingOrders, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Products', value: stats.totalProducts, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Users', value: stats.totalUsers, color: 'text-accent', bg: 'bg-red-50' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {stats.monthlySales.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Monthly Sales</h3>
              <div className="flex items-end gap-2 h-48">
                {stats.monthlySales.map((m, i) => {
                  const maxRev = Math.max(...stats.monthlySales.map(x => x.revenue));
                  const height = (m.revenue / maxRev) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{formatPKR(m.revenue)}</span>
                      <div className="w-full bg-accent rounded-t-md transition-all" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-400">{m._id.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent text-sm">{formatPKR(order.totalAmount)}</p>
                    <span className={`text-xs font-medium ${
                      order.status === 'delivered' ? 'text-success' : order.status === 'cancelled' ? 'text-red-500' : 'text-yellow-600'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p>{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">{formatPKR(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{order.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-accent">
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/order-success/${order._id}`)} className="text-accent hover:text-accent-light text-xs font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4">
              <input placeholder="Product Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" required />
              <input placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              <input type="number" placeholder="Price (PKR)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" required />
              <input type="number" placeholder="Original Price (PKR)" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white">
                <option>Men</option><option>Women</option><option>Accessories</option><option>Shoes</option>
              </select>
              <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              <input placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="md:col-span-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="rounded" /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.onSale} onChange={(e) => setProductForm({ ...productForm, onSale: e.target.checked })} className="rounded" /> On Sale</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-light transition">{editingProduct ? 'Update' : 'Add'} Product</button>
                {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', originalPrice: '', category: 'Men', image: '', stock: '', featured: false, onSale: false }); }} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-300 transition">Cancel</button>}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { e.target.src = 'https://placehold.co/80x80/f3f4f6/999'; }} />
                          <div>
                            <p className="font-medium">{p.name}</p>
                            {p.featured && <span className="text-xs bg-accent/10 text-accent px-1.5 rounded">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3 font-medium">{formatPKR(p.price)}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice, category: p.category, image: p.image, stock: p.stock, featured: p.featured, onSale: p.onSale }); }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                          <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">{u.name?.charAt(0)}</div>
                <div>
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                {u.role !== 'admin' && (
                  <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
