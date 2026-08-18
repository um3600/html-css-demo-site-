import { createContext, useContext, useState, useEffect } from 'react';
import { formatPKR } from '../utils/helpers';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.image, quantity }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(i => i._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const getTotal = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getItemCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  const getShipping = () => getTotal() >= 5000 ? 0 : 250;
  const getTax = () => Math.round(getTotal() * 0.05);
  const getGrandTotal = () => getTotal() + getShipping() + getTax();

  const getFormattedTotal = () => formatPKR(getGrandTotal());

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      getTotal, getItemCount, getShipping, getTax, getGrandTotal, getFormattedTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
