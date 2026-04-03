import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axiosClient.get('/giohang');
      // Backend trả về $giohang kèm chitietgiohangs
      const data = response.data.data;
      if (data && data.chitietgiohangs) {
        setCartItems(data.chitietgiohangs);
      }
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (sach_id) => {
    try {
      await axiosClient.delete(`/giohang/${sach_id}`);
      toast.success('Đã xóa sản phẩm');
      setCartItems(cartItems.filter(item => item.sach_id !== sach_id));
    } catch (error) {
      toast.error('Lỗi khi xóa sản phẩm');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.thanh_tien), 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải giỏ hàng...</div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Giỏ hàng của bạn</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '1rem' }}>
          <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem' }}>Giỏ hàng đang trống.</p>
          <Link to="/" style={{ color: '#2563eb', fontWeight: 'bold' }}>Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Cột danh sách sản phẩm */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.sach_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.sach?.ten_sach || `Mã Sách: ${item.sach_id}`}</h3>
                  <p style={{ color: '#6b7280' }}>Số lượng: {item.so_luong} x {Number(item.don_gia).toLocaleString()}đ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{Number(item.thanh_tien).toLocaleString()} đ</span>
                  <button onClick={() => handleRemoveItem(item.sach_id)} style={{ color: '#ef4444', fontWeight: 'bold' }}>Xóa</button>
                </div>
              </div>
            ))}
          </div>

          {/* Cột Tổng tiền & Thanh toán */}
          <div style={{ flex: '1 1 300px', padding: '1.5rem', background: '#f9fafb', borderRadius: '1rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tóm tắt đơn hàng</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Tổng cộng:</span>
              <span style={{ color: '#ef4444' }}>{totalAmount.toLocaleString()} đ</span>
            </div>
            <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;