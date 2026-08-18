import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productAPI.getCategories()
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {});
  }, []);

  const catImages = {
    Men: '/images/333.jpg',
    Women: '/images/download-2.jpg',
    Accessories: '/images/download (1).jpg',
    Shoes: '/images/shoes.png'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Shop by Category</h1>
        <p className="text-gray-500">Browse our curated collections</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/shop?category=${cat.name}`}
            className="group relative rounded-2xl overflow-hidden aspect-[16/9] shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <img src={catImages[cat.name]} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center p-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{cat.name}</h2>
                <p className="text-white/70 mb-4">{cat.count} products</p>
                <span className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm group-hover:bg-accent transition">
                  Browse Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
