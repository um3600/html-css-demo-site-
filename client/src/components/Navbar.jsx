import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">EcomShop</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-white transition text-sm font-medium">Home</Link>
            <Link to="/shop" className="text-gray-300 hover:text-white transition text-sm font-medium">Shop</Link>
            <Link to="/categories" className="text-gray-300 hover:text-white transition text-sm font-medium">Categories</Link>
            <Link to="/blog" className="text-gray-300 hover:text-white transition text-sm font-medium">Blog</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition text-sm font-medium">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link to="/cart" className="relative text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getItemCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition" title="Admin Dashboard">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                )}
                <Link to="/orders" className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition" title="My Orders">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={logout} className="text-gray-400 hover:text-accent text-sm transition">Logout</button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition">Login</Link>
                <Link to="/register" className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2 rounded-lg transition">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10">
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-accent"
                autoFocus
              />
              <button type="submit" className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-lg font-medium transition">Search</button>
            </form>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 animate-slide-down">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Home</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Shop</Link>
            <Link to="/categories" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Categories</Link>
            <Link to="/blog" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Blog</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Contact</Link>
            <hr className="border-white/10" />
            {user ? (
              <>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-accent hover:bg-white/10 px-3 py-2.5 rounded-lg transition font-medium">Admin Dashboard</Link>}
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">My Orders</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left text-gray-400 hover:text-accent px-3 py-2.5 rounded-lg transition">Logout ({user.name})</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block bg-accent text-white text-center px-3 py-2.5 rounded-lg transition font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
