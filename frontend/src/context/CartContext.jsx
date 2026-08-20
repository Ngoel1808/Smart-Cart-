import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useData } from './DataContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useLocalStorage('smartcart_cart', []);
  const { products, offers } = useData();

  const addToCart = (productId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCartItems([]);

  // Complex calculation logic for BOGO and % discounts
  const cartTotals = cartItems.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return acc;

    const offer = offers.find(o => o.productId === item.productId);
    const itemTotal = product.sellingPrice * item.quantity;
    let itemDiscount = 0;

    if (offer) {
      if (offer.type === 'BOGO') {
        // e.g. Buy 1 get 1 free. buyQuantity=1, freeQuantity=1. 
        // Group size = buyQuantity + freeQuantity (e.g. 2). 
        // Number of free items = Math.floor(total / groupSize) * freeQuantity
        const groupSize = offer.buyQuantity + offer.freeQuantity;
        const freeItems = Math.floor(item.quantity / groupSize) * offer.freeQuantity;
        itemDiscount = freeItems * product.sellingPrice;
      } else if (offer.type === 'PERCENTAGE') {
        itemDiscount = (itemTotal * offer.discountValue) / 100;
      } else if (offer.type === 'FLAT') {
        itemDiscount = offer.discountValue * item.quantity;
      }
    }

    acc.subtotal += itemTotal;
    acc.discount += itemDiscount;
    return acc;
  }, { subtotal: 0, discount: 0 });

  cartTotals.total = cartTotals.subtotal - cartTotals.discount;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
