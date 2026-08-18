import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPKR, calculateDiscount } from '../utils/helpers';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/f3f4f6/999?text=Product'; }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.onSale && !discount && (
          <span className="absolute top-3 left-3 bg-success text-white text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-accent transition line-clamp-2 text-sm">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-accent">{formatPKR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPKR(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="w-full bg-primary hover:bg-secondary text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
