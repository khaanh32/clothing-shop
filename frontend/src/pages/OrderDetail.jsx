import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { Package, ArrowLeft, XCircle, CheckCircle2, Clock, Loader, MapPin, Truck, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import '../styles/design-system.css';

const fmt     = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'CHỜ_XÁC_NHẬN': case 'CHỜ_LẤY_HÀNG':
      return <span className="ds-badge ds-badge-wait"><Clock size={11} /> Chờ xử lý</span>;
    case 'ĐANG_GIAO_HÀNG':
      return <span className="ds-badge ds-badge-info"><Package size={11} /> Đang giao</span>;
    case 'ĐÃ_GIAO_HÀNG':
      return <span className="ds-badge ds-badge-success"><CheckCircle2 size={11} /> Đã giao</span>;
    case 'ĐÃ_HỦY': case 'HỦY':
      return <span className="ds-badge ds-badge-danger"><XCircle size={11} /> Đã hủy</span>;
    default:
      return <span className="ds-badge ds-badge-wait">{status}</span>;
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const { user, loading: authLoad } = useAuth();
  const navigate = useNavigate();

  const [order,     setOrder]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error,     setError]     = useState(false);

  useEffect(() => {
    if (authLoad) return;
    if (!user) { navigate('/login'); return; }
    orderAPI.getOrderDetail(id)
      .then(res => setOrder(res.data?.data || res.data))
      .catch(() => { setError(true); toast.error('Không tìm thấy đơn hàng'); })
      .finally(() => setLoading(false));
  }, [id, user, authLoad, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setCanceling(true);
    try {
      await orderAPI.cancelOrder(id);
      toast.success('Hủy đơn hàng thành công');
      setOrder(p => ({ ...p, trang_thai: 'ĐÃ_HỦY' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy lúc này');
    } finally { setCanceling(false); }
  };

  if (loading) return (
    <div className="ds-page" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <Loader size={38} className="ds-spin" style={{ color: '#1e3a5f' }} />
    </div>
  );
  if (error || !order) return (
    <div className="ds-page">
      <div className="ds-wrap" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <AlertCircle size={52} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}>Không tìm thấy đơn hàng</h2>
        <Link to="/orders" className="ds-btn-outline" style={{ display: 'inline-flex', width: 'auto' }}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>
    </div>
  );

  const items     = order.chitietdonhangs || order.chi_tiet_don_hangs || order.chitietdonhang || [];
  const canCancel = order.trang_thai === 'CHỜ_XÁC_NHẬN';

  return (
    <div className="ds-page">
      <div className="ds-wrap">

        {/* Back Link */}
        <Link to="/orders" className="od-back">
          <ArrowLeft size={15} /> Quay lại danh sách đơn hàng
        </Link>

        {/* Header */}
        <div className="od-hd">
          <h1 className="od-title">Chi tiết đơn hàng #{order.id}</h1>
          <StatusBadge status={order.trang_thai} />
        </div>

        <div className="od-layout">
          {/* Main Col */}
          <div className="od-col-main">
            {/* Products */}
            <div className="ds-card" style={{ marginBottom: '1.25rem' }}>
              <h2 className="ds-card-title"><Package size={16} /> Sản phẩm đã đặt</h2>
              <div className="od-items">
                {items.length === 0 && <p className="od-empty-text">Không có sản phẩm nào.</p>}
                {items.map((it, idx) => (
                  <div key={it.id || it.sach_id} className={`od-item${idx < items.length - 1 ? ' sep' : ''}`}>
                    <img src={it.sach?.anh_bia || 'https://picsum.photos/seed/b/50/70'} alt="cover" className="od-img" />
                    <div className="od-meta">
                      <Link to={`/product/${it.sach_id}`} className="od-name">{it.sach?.ten_sach || `Sách #${it.sach_id}`}</Link>
                      <span className="od-price-qty">{fmt(it.don_gia)} <span style={{color: '#9ca3af', margin: '0 4px'}}>x</span> {it.so_luong}</span>
                    </div>
                    <span className="od-total">{fmt(it.thanh_tien)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address info */}
            <div className="ds-card">
              <h2 className="ds-card-title"><MapPin size={16} /> Thông tin nhận hàng</h2>
              <div className="od-info-grid">
                <div className="od-info-row"><span>Người nhận</span>  <strong>{order.ten_nguoi_nhan}</strong></div>
                <div className="od-info-row"><span>Số điện thoại</span><strong>{order.sdt_nguoi_nhan}</strong></div>
                <div className="od-info-row"><span>Địa chỉ giao</span> <strong>{order.dia_chi_giao_hang}</strong></div>
                <div className="od-info-row"><span>Ghi chú</span>      <strong>{order.ghi_chu || 'Không có'}</strong></div>
              </div>
            </div>
          </div>

          {/* Side Col */}
          <div className="od-col-side">
            <div className="ds-card" style={{ position: 'sticky', top: '80px' }}>
              <h2 className="ds-card-title"><FileText size={16} /> Tổng quan đơn hàng</h2>
              <div className="od-sum-bd">
                <div className="od-sum-row">
                  <span className="od-sum-lbl">Ngày đặt hàng:</span>
                  <span className="od-sum-val">{fmtDate(order.ngay_tao)}</span>
                </div>
                <div className="od-sum-row">
                  <span className="od-sum-lbl" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={14}/> Thanh toán:</span>
                  <span className="od-sum-val">{order.phuong_thuc_thanh_toan}</span>
                </div>

                <div className="od-sum-line" />

                <div className="od-sum-grand">
                  <span>Tổng thanh toán</span>
                  <span className="od-sum-grand-val">{fmt(order.thanh_tien || order.tong_tien)}</span>
                </div>

                {canCancel && (
                  <button
                    className="ds-btn-primary od-cancel-btn"
                    onClick={handleCancel} disabled={canceling}>
                    {canceling ? <Loader size={16} className="ds-spin" /> : <XCircle size={16} />}
                    {canceling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .od-back {
          display: inline-flex; align-items: center; gap: 6px;
          margin-bottom: 1.25rem; font-size: 0.85rem; font-weight: 500;
          color: #6b7280; text-decoration: none; transition: color .15s;
        }
        .od-back:hover { color: #1e3a5f; text-decoration: underline; }

        .od-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 10px; }
        .od-title { font-size: 1.4rem; font-weight: 900; color: #111827; margin: 0; }

        .od-layout { display: grid; grid-template-columns: 1fr 340px; gap: 1.25rem; align-items: start; }

        /* Items list */
        .od-items { padding: 0.5rem 1.4rem; }
        .od-item { display: flex; align-items: center; gap: 14px; padding: 1rem 0; }
        .od-item.sep { border-bottom: 1px solid #f1f5f9; }
        .od-img { width: 54px; height: 72px; border-radius: 6px; object-fit: cover; border: 1px solid #f1f3f6; }
        .od-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .od-name { font-size: 0.9rem; font-weight: 700; color: #111827; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .od-name:hover { color: #1e3a5f; text-decoration: underline; }
        .od-price-qty { font-size: 0.82rem; font-weight: 600; color: #4b5563; }
        .od-total { font-size: 0.95rem; font-weight: 800; color: #dc2626; flex-shrink: 0; }
        .od-empty-text { font-size: 0.85rem; color: #6b7280; padding: 1rem 0; margin: 0; }

        /* Info Grid */
        .od-info-grid { padding: 1.2rem 1.4rem 1.4rem; display: flex; flex-direction: column; gap: 0.85rem; }
        .od-info-row { display: flex; font-size: 0.88rem; }
        .od-info-row span { width: 140px; color: #6b7280; flex-shrink: 0; }
        .od-info-row strong { color: #111827; font-weight: 600; line-height: 1.4; }

        /* Summary */
        .od-sum-bd { padding: 1.25rem; }
        .od-sum-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.6rem; }
        .od-sum-lbl { color: #6b7280; }
        .od-sum-val { color: #111827; font-weight: 600; }
        .od-sum-line { height: 1px; background: #e9ecef; margin: 1.2rem 0; }
        .od-sum-grand { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 600; color: #111827; }
        .od-sum-grand-val { font-size: 1.3rem; font-weight: 900; color: #dc2626; }
        .od-cancel-btn { background: #dc2626; margin-top: 1.5rem; }
        .od-cancel-btn:hover:not(:disabled) { background: #b91c1c; }

        @media (max-width: 900px) { .od-layout { grid-template-columns: 1fr; } }
        @media (max-width: 480px) {
          .od-item { align-items: flex-start; }
          .od-info-row { flex-direction: column; gap: 3px; }
          .od-info-row span { width: auto; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
