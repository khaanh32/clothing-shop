import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import CartItem from '../components/CartItem';
import axiosClient from '../axiosClient';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [formData, setFormData] = useState({
    fullName: user?.ten_dang_nhap || '',
    phone: user?.so_dien_thoai || '',
    address: user?.dia_chi || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await axiosClient.get('/giohang');
        const items = response.data.data || response.data;
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.sach?.gia_ban || item.sach?.gia || item.price || 0;
    const quantity = item.so_luong || item.quantity || 1;
    return total + (price * quantity);
  }, 0);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    
    setSubmitting(true);
    try {
      await axiosClient.post('/checkout', {
        ho_ten: formData.fullName,
        so_dien_thoai: formData.phone,
        dia_chi: formData.address,
        phuong_thuc_thanh_toan: paymentMethod
      });
      toast.success('Đặt hàng thành công!');
      navigate('/confirm');
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light">
      <div className="page-container">
        <StepIndicator currentStep={2} />
        
        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="card checkout-form-card">
              <h2 className="card-title">Thông tin thanh toán</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form">
                <input 
                  type="text" 
                  placeholder="Họ và tên" 
                  className="checkout-input"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Số điện thoại" 
                  className="checkout-input"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Địa chỉ" 
                  className="checkout-input"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
                
                <div className="payment-methods">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="transfer" 
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                    />
                    <span className="radio-custom"></span>
                    Chuyển khoản ngân hàng
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <span className="radio-custom"></span>
                    Thanh toán khi nhận hàng
                  </label>
                </div>
              </form>
            </div>

            {paymentMethod === 'transfer' && (
              <div className="card qr-card">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0948342040" alt="QR Code" className="qr-img" />
                <div className="bank-info">
                  <p>STK: 0948342040</p>
                  <p>VO THAI ANH</p>
                  <p>MB BANK</p>
                  <p>NỘI DUNG: Sach_01</p>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-right">
            <div className="card order-summary-card">
              {loading ? (
                <p>Đang tải...</p>
              ) : cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CartItem item={item} readonly={true} />
                  {index < cartItems.length - 1 && <hr className="cart-divider" />}
                </React.Fragment>
              ))}
            </div>

            <div className="card total-card-small">
              <div className="total-row">
                <span className="total-label">Tổng cộng:</span>
                <span className="total-value">{formatPrice(totalAmount)}</span>
              </div>
              <div className="total-row final" style={{ marginTop: '1rem' }}>
                <span className="total-value final-price">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" className="btn-primary full-width" disabled={submitting || cartItems.length === 0}>
              {submitting ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
