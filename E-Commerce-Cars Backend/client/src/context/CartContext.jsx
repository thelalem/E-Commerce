// CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axiosClient from '../utils/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (currentUser) {
          const res = await axiosClient.get('/cart');
          setCartItems(res.data.cartItems || []);
        }
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };

    fetchCart();
  }, [currentUser]);

  const addToCart = async (product) => {
    try {
      console.log('Adding to cart:', product);
      const res = await axiosClient.post('/cart/add', { 
        productId: product._id || product.id,
        quantity: 1 
      });
      setCartItems(res.data.cartItems); // Replace with updated cart from server
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axiosClient.delete(`/cart/remove/${productId}`);
      setCartItems(res.data.cartItems);
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Update the quantity in the backend
      const res = await axiosClient.patch('/cart/update', { productId, quantity: newQuantity });

      // Use the updated cart items directly from the backend response
      setCartItems(res.data.cartItems);
    } catch (err) {
      console.error('Update cart quantity error:', err);
    }
  };
  

  const clearCart = async () => {
    try {
      await axiosClient.delete('/cart/clear');
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
