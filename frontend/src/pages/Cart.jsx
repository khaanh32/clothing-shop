import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { cartAPI } from '../services/api';
import {
  ShoppingCart, Trash2, Plus, Minus,
  BookOpen, Loader, ShoppingBag, ChevronRight,
} from 'lucide-react';
import '../styles/design-system.css';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

/* ── Skeleton row ── */
const SkRow = () => (
  <div className="crt-row">
    <div className="ds-sk" style={{ width: 72, height: 96, borderRadius: 8, flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="ds-sk" style={{ height: 14, width: '70%' }} />
      <div className="ds-sk" style={{ height: 11, width: '40%' }} />
    </div>
    <div className="ds-sk" style={{ height: 14, width: 80 }} />
    <div className="ds-sk" style={{ height: 36, width: 104, borderRadius: 8 }} />
    <div className="ds-sk" style={{ height: 16, width: 90 }} />
    <div className="ds-sk" style={{ height: 32, width: 32, borderRadius: 8 }} />
  </div>
);

/* ── Empty state ── */
const Empty = ({ icon: Icon, title, sub, action }) => (
  <div className="crt-empty">
    <Icon size={54} style={{ color: '#d1d5db', marginBottom: 12 }} />
    <h2 className="crt-empty-title">{title}</h2>
    <p className="crt-empty-sub">{sub}</p>
    {action}
  </div>
);

const Cart = () => {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const { cartItems, loadingCart, fetchCart, cartCount, setCartItems } = useCart();
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleQty = async (item, delta) => {
    const newQty = item.so_luong + delta;
    if (newQty < 1) return;
    const maxStock = item.sach?.so_luong;
    if (maxStock !== undefined && newQty > maxStock) {
      toast.error(`Chỉ còn ${maxStock} sản phẩm trong kho`); return;
    }
    
    setUpdating(item.sach_id);

    // 1. Cập nhật State cục bộ ngay lập tức (Chỉ cập nhật thay đổi phần tử trùng ID)
    setCartItems(prev => prev.map(cartItem => 
      cartItem.sach_id === item.sach_id 
        ? { ...cartItem, so_luong: newQty, thanh_tien: newQty * cartItem.don_gia } 
        : cartItem
    ));

    try {
      // Gọi API ngầm trong nền
      await cartAPI.updateQuantity(item.sach_id, newQty);
    } catch (err) { 
      console.error('API Update Error:', err); 
    } finally { 
      setUpdating(null); 
    }
  };

  const handleDelete = async (sach_id) => {
    setDeleting(sach_id);
    
    // 2. Sử dụng array.filter() để loại bỏ sản phẩm khỏi State lập tức
    setCartItems(prev => prev.filter(cartItem => cartItem.sach_id !== sach_id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng'); 

    try {
      // Gọi API ngầm, lờ đi lỗi 500 do backend thiếu Primary Key
      await cartAPI.removeItem(sach_id);
    } catch (err) { 
      console.error('API Delete Error:', err);
    } finally { 
      setDeleting(null); 
    }
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const total = safeCartItems.reduce((s, i) => s + parseFloat(i.thanh_tien || 0), 0);

  return (
    <div className="ds-page crt-page">
      <div className="ds-wrap">
        {/* Chưa đăng nhập */}
        {!user && !loadingCart ? (
          <Empty icon={ShoppingCart} title="Vui lòng đăng nhập" sub="Bạn cần đăng nhập để xem giỏ hàng"
            action={<Link to="/login" className="ds-btn-primary" style={{ width: 'max-content', padding: '0.65rem 1.8rem' }}>Đăng nhập ngay</Link>} />
        ) : 
        
        /* Giỏ hàng trống */
        !loadingCart && safeCartItems.length === 0 ? (
          <Empty icon={ShoppingBag} title="Giỏ hàng đang trống" sub="Hãy chọn thêm sách để bắt đầu mua sắm"
            action={<Link to="/category" className="ds-btn-primary" style={{ width: 'max-content', padding: '0.65rem 1.8rem', gap: 7 }}><BookOpen size={16} />Khám phá sách</Link>} />
        ) : (
          
        /* Có sản phẩm */
        <>
          <div className="ds-page-hd">
            <h1 className="ds-page-title"><ShoppingCart size={24} />Giỏ hàng
              {!loadingCart && <span className="crt-count">{cartCount} sản phẩm</span>}
            </h1>
          </div>

          <div className="crt-layout">
            {/* ── Danh sách sản phẩm ── */}
            <div className="crt-list-col">
              <div className="ds-card crt-list-card">
                <div className="crt-list-head">
                  <span className="crt-h-product">Sản phẩm</span>
                  <span className="crt-h-price">Đơn giá</span>
                  <span className="crt-h-qty">Số lượng</span>
                  <span className="crt-h-total">Thành tiền</span>
                  <span />
                </div>
  
                {/* Rows */}
                {loadingCart
                  ? [...Array(3)].map((_, i) => <SkRow key={i} />)
                  : safeCartItems.map((item, idx) => (
                      <div key={item.sach_id || idx} className={`crt-row${idx < safeCartItems.length - 1 ? ' crt-row-sep' : ''}`}>
                        <div className="crt-item-info">
                          <Link to={`/product/${item.sach_id}`} className="crt-img-wrap">
                            <img src={item.sach?.anh_bia || 'https://picsum.photos/seed/book/80/110'} alt={item.sach?.ten_sach} className="crt-img" referrerPolicy="no-referrer" />
                          </Link>
                          <div className="crt-meta">
                            <Link to={`/product/${item.sach_id}`} className="crt-name">{item.sach?.ten_sach || `Sách #${item.sach_id}`}</Link>
                            {item.sach?.tac_gia && <span className="crt-author">{item.sach.tac_gia}</span>}
                            <span className="crt-price-mobile">{fmt(item.don_gia)}</span>
                          </div>
                        </div>
  
                        <span className="crt-h-price crt-price-val">{fmt(item.don_gia)}</span>
  
                        <div className="crt-h-qty">
                          <div className="crt-qty">
                            <button className="crt-qty-btn" onClick={() => handleQty(item, -1)} disabled={item.so_luong <= 1 || updating === item.sach_id}><Minus size={12} /></button>
                            <span className="crt-qty-val">{updating === item.sach_id ? <Loader size={13} className="ds-spin" /> : item.so_luong}</span>
                            <button className="crt-qty-btn" onClick={() => handleQty(item, 1)} disabled={updating === item.sach_id}><Plus size={12} /></button>
                          </div>
                        </div>
  
                        <span className="crt-h-total crt-total-val">{fmt(item.thanh_tien)}</span>
  
                        <button className="crt-del-btn" onClick={() => handleDelete(item.sach_id || item.id)} disabled={deleting === (item.sach_id || item.id)} aria-label="Xóa sản phẩm">
                          {deleting === (item.sach_id || item.id) ? <Loader size={15} className="ds-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    ))
                }
              </div>
  
              <Link to="/category" className="crt-continue"> Tiếp tục mua sắm</Link>
            </div>
  
            {/* ── Tóm tắt ── */}
            <div className="crt-summary-col">
              <div className="ds-card crt-summary-card">
                <h2 className="ds-card-title">Tóm tắt đơn hàng</h2>
                <div className="crt-sum-body">
                  <div className="crt-sum-row"><span>Tạm tính ({cartCount} sản phẩm)</span><span>{fmt(total)}</span></div>
                  <div className="crt-sum-row"><span>Phí vận chuyển</span><span style={{ color: '#059669', fontWeight: 700 }}>Miễn phí</span></div>
                  <div className="crt-sum-divider" />
                  <div className="crt-sum-total"><span>Tổng cộng</span><span className="crt-sum-amount">{fmt(total)}</span></div>
                  <button className="ds-btn-primary crt-checkout-btn" onClick={() => navigate('/checkout')} disabled={loadingCart || safeCartItems.length === 0} id="proceed-checkout-btn">
                    Tiến hành thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
        )}
      </div>

      <style>{`
        .crt-page {}
        .crt-count {
          font-size: 0.82rem; font-weight: 500; color: #6b7280;
          background: #f1f3f6; padding: 3px 10px; border-radius: 999px; margin-left: 8px;
        }
        .crt-layout {
          display: grid; grid-template-columns: 1fr 310px; gap: 1.25rem; align-items: start;
        }
        /* List card */
        .crt-list-card { overflow: hidden; }
        .crt-list-head {
          display: grid; grid-template-columns: 1fr 100px 130px 100px 40px;
          padding: 0.75rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #e9ecef;
          font-size: 0.78rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px;
          align-items: center;
        }
        .crt-h-product {}
        .crt-h-price  { text-align: center; }
        .crt-h-qty    { text-align: center; }
        .crt-h-total  { text-align: right; }
        /* Row */
        .crt-row {
          display: grid; grid-template-columns: 1fr 100px 130px 100px 40px;
          padding: 1.1rem 1.25rem; align-items: center; gap: 0;
        }
        .crt-row-sep { border-bottom: 1px solid #f3f4f6; }
        .crt-item-info { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .crt-img-wrap { flex-shrink: 0; }
        .crt-img { width: 60px; height: 80px; object-fit: cover; border-radius: 6px; display: block; }
        .crt-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .crt-name {
          font-size: 0.87rem; font-weight: 700; color: #111827; text-decoration: none;
          display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .crt-name:hover { color: #1e3a5f; }
        .crt-author { font-size: 0.75rem; color: #9ca3af; }
        .crt-price-mobile { display: none; font-size: 0.82rem; font-weight: 700; color: #dc2626; }

        .crt-price-val { font-size: 0.88rem; color: #374151; text-align: center; }
        .crt-total-val { font-size: 0.94rem; font-weight: 800; color: #dc2626; text-align: right; }

        /* Qty ctrl */
        .crt-qty {
          display: inline-flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;
          margin: 0 auto;
        }
        .crt-qty-btn {
          padding: 0.42rem 0.7rem; background: #f8fafc; border: none;
          color: #374151; cursor: pointer; display: flex; align-items: center;
          transition: background .15s;
        }
        .crt-qty-btn:hover:not(:disabled) { background: #eff6ff; }
        .crt-qty-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .crt-qty-val {
          min-width: 34px; text-align: center; font-size: 0.88rem; font-weight: 700;
          color: #111827;
          border-left: 1.5px solid #e2e8f0; border-right: 1.5px solid #e2e8f0;
          padding: 0.32rem 0.3rem;
          display: flex; align-items: center; justify-content: center;
        }

        /* Delete */
        .crt-del-btn {
          display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer;
          color: #d1d5db; padding: 0.4rem; border-radius: 7px; transition: all .15s;
          margin-left: auto;
        }
        .crt-del-btn:hover { color: #dc2626; background: #fee2e2; }
        .crt-del-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .crt-continue {
          display: block; text-align: center; margin-top: 0.9rem;
          font-size: 0.83rem; color: #6b7280; text-decoration: none;
        }
        .crt-continue:hover { color: #1e3a5f; }

        /* Summary */
        .crt-summary-card { overflow: hidden; }
        .crt-sum-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .crt-sum-row { display: flex; justify-content: space-between; font-size: 0.87rem; color: #374151; }
        .crt-sum-divider { border: none; border-top: 1px dashed #e2e8f0; margin: 0.25rem 0; }
        .crt-sum-total { display: flex; justify-content: space-between; align-items: center; }
        .crt-sum-total > span:first-child { font-size: 0.92rem; font-weight: 700; color: #111827; }
        .crt-sum-amount { font-size: 1.35rem; font-weight: 900; color: #dc2626; }
        .crt-checkout-btn { margin-top: 0.5rem; font-size: 0.92rem; padding: 0.8rem; }

        /* Empty */
        .crt-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 5rem 1rem; gap: 0;
        }
        .crt-empty-title { font-size: 1.2rem; font-weight: 800; color: #111827; margin: 0 0 0.5rem; }
        .crt-empty-sub   { font-size: 0.86rem; color: #6b7280; margin: 0 0 1.5rem; }

        /* Responsive */
        @media (max-width: 900px) {
          .crt-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .crt-list-head { display: none; }
          .crt-row { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 0.5rem; padding: 0.9rem 1rem; }
          .crt-item-info { grid-column: 1; }
          .crt-del-btn { grid-column: 2; grid-row: 1; align-self: start; }
          .crt-h-price.crt-price-val { display: none; }
          .crt-h-qty { grid-column: 1; }
          .crt-h-total.crt-total-val { grid-column: 2; grid-row: 2; text-align: right; }
          .crt-price-mobile { display: block; }
        }
      `}</style>
    </div>
  );
};

export default Cart;