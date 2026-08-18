import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const onSale = searchParams.get('onSale') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search) params.search = search;
    if (onSale) params.onSale = 'true';

    productAPI.getAll(params)
      .then(({ data }) => {
        setProducts(data.products);
        setPagination({ page: data.page, pages: data.pages, total: data.total });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, onSale, page]);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {category ? `${category} Collection` : search ? `Search: "${search}"` : 'All Products'}
        </h1>
        <p className="text-gray-500">{pagination.total} products found</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => updateParams('category', '')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >All</button>
        {['Men', 'Women', 'Accessories', 'Shoes'].map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams('category', cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >{cat}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateParams('onSale', onSale ? '' : 'true')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${onSale ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-600 hover:border-accent hover:text-accent'}`}
          >On Sale</button>
        </div>
        <select
          value={sort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-accent bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-80"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParams('page', String(i + 1))}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
