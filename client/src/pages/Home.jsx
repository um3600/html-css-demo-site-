import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Men', image: '/images/333.jpg', color: 'from-blue-600 to-blue-800' },
  { name: 'Women', image: '/images/download-2.jpg', color: 'from-pink-500 to-pink-700' },
  { name: 'Accessories', image: '/images/download (1).jpg', color: 'from-amber-500 to-amber-700' },
  { name: 'Shoes', image: '/images/shoes.png', color: 'from-emerald-500 to-emerald-700' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll({ featured: 'true', limit: 8 })
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary via-secondary to-dark min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/slider1.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-accent/30">New Collection 2026</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Elevate Your <span className="text-accent">Style</span> Today
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Discover premium fashion, accessories, and footwear at unbeatable prices. Delivering across Pakistan with JazzCash &amp; COD.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-accent hover:bg-accent-light text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-accent/30 hover:shadow-accent/50">
                Shop Now
              </Link>
              <Link to="/categories" className="border-2 border-white/30 hover:border-white text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10">
                Browse Categories
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">24+</p>
                <p className="text-sm text-gray-400">Products</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-sm text-gray-400">Categories</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-400">Genuine</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Shop by Category</h2>
          <p className="text-gray-500">Find exactly what you are looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-80 transition`}></div>
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                  <p className="text-white/70 text-sm mt-1">Explore Collection</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-500">Handpicked items just for you</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-accent hover:text-accent-light font-medium transition">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="md:hidden mt-8 text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-accent to-pink-600 rounded-3xl p-8 md:p-14 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Limited Time Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">Up to 50% Off on Selected Items</h2>
            <p className="text-white/80 mb-8">Grab premium fashion at unbelievable prices. Free shipping on orders above Rs. 5,000!</p>
            <Link to="/shop?onSale=true" className="inline-block bg-white text-accent font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition shadow-lg">
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Why Shop With Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Free Shipping', desc: 'On orders above Rs. 5,000' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Secure Payment', desc: 'JazzCash & COD accepted' },
              { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: '24/7 Support', desc: 'Always here to help' }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
