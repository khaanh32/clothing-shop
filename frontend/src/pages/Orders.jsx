import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';
import { Package, Clock, XCircle, CheckCircle2, FileText, Loader, ChevronRight, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/design-system.css';

const fmt        = (n)  => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
const fmtDate    = (d)  => {
  if (!d) return '';
  const [year, month, day] = d.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

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

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setCancelingId(orderId);
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Hủy đơn hàng thành công');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trang_thai: 'ĐÃ_HỦY' } : o));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy lúc này');
    } finally { setCancelingId(null); }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    orderAPI.getOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => toast.error('Không thể tải danh sách đơn hàng.'))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  if (loading) return (
    <div className="ds-page" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <Loader size={38} className="ds-spin" style={{ color: '#1e3a5f' }} />
    </div>
  );

  return (
    <div className="ds-page">
      <div className="ds-wrap">
        {/* Tiêu đề */}
        <div className="ds-page-hd">
          <h1 className="ds-page-title"><Package size={24} />Quản lý đơn hàng</h1>
          <p className="ds-page-sub">Xem lịch sử và trạng thái theo dõi đơn hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="ds-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FileText size={52} style={{ color: '#d1d5db', marginBottom: 14 }} />
            <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: 8 }}>Bạn chưa có đơn hàng nào</h2>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!</p>
            <button onClick={() => navigate('/category')} className="ds-btn-primary" style={{ width: 'auto', padding: '0.7rem 2rem', margin: '0 auto' }}>
              Bắt đầu mua sắm
            </button>
          </div>
        ) : (
          <div className="ords-list">
            {orders.map(order => (
              <div key={order.id} className="ds-card ords-card">
                {/* Header */}
                <div className="ords-card-hd">
                  <div className="ords-card-id">
                    <span className="ords-id-label">Đơn hàng</span>
                    <span className="ords-id-val">#{order.id}</span>
                  </div>
                  <StatusBadge status={order.trang_thai} />
                </div>

                {/* Body */}
                <div className="ords-card-body">
                  <div className="ords-info-grid">
                    <div className="ords-info-item">
                      <Calendar size={13} className="ords-ico" />
                      <span className="ords-info-label">Ngày đặt:</span>
                      <span className="ords-info-val">{fmtDate(order.ngay_tao)}</span>
                    </div>
                    <div className="ords-info-item">
                      <Package size={13} className="ords-ico" />
                      <span className="ords-info-label">Người nhận:</span>
                      <span className="ords-info-val">{order.ten_nguoi_nhan} · {order.sdt_nguoi_nhan}</span>
                    </div>
                    <div className="ords-info-item">
                      <CreditCard size={13} className="ords-ico" />
                      <span className="ords-info-label">Thanh toán:</span>
                      <span className="ords-info-val">{order.phuong_thuc_thanh_toan}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="ords-card-ft">
                  <div className="ords-total-wrap">
                    <span className="ords-total-label">Tổng cộng</span>
                    <span className="ords-total-val">{fmt(order.thanh_tien || order.tong_tien)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {order.trang_thai === 'CHỜ_XÁC_NHẬN' && (
                      <button
                        className="ords-cancel-btn"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelingId === order.id}
                      >
                        {cancelingId === order.id ? <Loader size={14} className="ds-spin" /> : <XCircle size={14} />}
                        Hủy đơn
                      </button>
                    )}
                    <Link to={`/orders/${order.id}`} className="ords-detail-btn">
                      Xem chi tiết <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ords-list { display: flex; flex-direction: column; gap: 1rem; }

        /* Card */
        .ords-card { overflow: hidden; }
        .ords-card-hd {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.4rem; border-bottom: 1px solid #f1f5f9; background: #fafbfc;
        }
        .ords-card-id { display: flex; align-items: baseline; gap: 6px; }
        .ords-id-label { font-size: 0.78rem; color: #6b7280; font-weight: 500; }
        .ords-id-val   { font-size: 0.98rem; font-weight: 900; color: #1e3a5f; }

        /* Body */
        .ords-card-body { padding: 1rem 1.4rem; }
        .ords-info-grid { display: flex; flex-wrap: wrap; gap: 0.6rem 2rem; }
        .ords-info-item { display: flex; align-items: center; gap: 6px; font-size: 0.83rem; }
        .ords-ico { color: #94a3b8; flex-shrink: 0; }
        .ords-info-label { color: #6b7280; }
        .ords-info-val   { color: #111827; font-weight: 600; }

        /* Footer */
        .ords-card-ft {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1.4rem; border-top: 1px solid #f1f5f9;
        }
        .ords-total-wrap { display: flex; align-items: baseline; gap: 8px; }
        .ords-total-label { font-size: 0.82rem; color: #6b7280; }
        .ords-total-val   { font-size: 1.15rem; font-weight: 900; color: #dc2626; }

        .ords-detail-btn {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.83rem; font-weight: 700; color: #1e3a5f;
          text-decoration: none; padding: 0.45rem 0.9rem;
          border: 1.5px solid #1e3a5f; border-radius: 8px;
          transition: all .15s;
        }
        .ords-detail-btn:hover { background: #1e3a5f; color: #fff; }

        .ords-cancel-btn {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.83rem; font-weight: 600; color: #dc2626;
          background: transparent;
          border: 1px solid #dc2626; border-radius: 8px;
          padding: 0.45rem 0.9rem; cursor: pointer; transition: all .15s;
        }
        .ords-cancel-btn:hover:not(:disabled) { background: #dc2626; color: #fff; }
        .ords-cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default Orders;
