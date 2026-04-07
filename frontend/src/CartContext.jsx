import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from './services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }
    setLoadingCart(true);
    try {
      const res = await cartAPI.getCart();
      const cartData = res.data?.data?.thong_tin_gio_hang;
      const items = cartData?.chitietgiohangs || cartData?.chitietgiohang || [];
      setCartItems(items);
    } catch (error) {
      console.error('Lỗi tải giỏ hàng:', error);
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  // Tự động tải lại giỏ hàng khi có user đăng nhập/chuyển user
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Tính tổng số lượng
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = safeCartItems.reduce((acc, item) => acc + item.so_luong, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, loadingCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
