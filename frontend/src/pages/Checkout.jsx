import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { orderAPI } from '../services/api';
import {
  User, Phone, MapPin, MessageSquare, CreditCard, Truck,
  CheckCircle2, ShoppingCart, Loader, AlertCircle
} from 'lucide-react';
import '../styles/design-system.css';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

const validators = {
  ten_nguoi_nhan: (v) => v.trim().length >= 2 ? '' : 'Họ tên tối thiểu 2 ký tự',
  sdt_nguoi_nhan: (v) => /^(0|\+84)[0-9]{9}$/.test(v.trim()) ? '' : 'SĐT không hợp lệ',
  dia_chi_giao_hang: (v) => v.trim().length >= 5 ? '' : 'Địa chỉ quá ngắn',
};

const Field = ({ ico: Ico, id, label, type='text', rows, form, errors, touched, onChange, onBlur }) => {
  const err = touched[id] && errors[id];
  const ok  = touched[id] && !errors[id];
  return (
    <div className="ds-field" style={{ marginBottom: rows ? '1rem' : '1.25rem' }}>
      <label className="ds-label" htmlFor={id}>{label}</label>
      <div className="ds-input-wrap" style={{ alignItems: rows ? 'flex-start' : 'center' }}>
        <Ico size={15} className="ds-input-ico" style={rows ? { top: '14px' } : {}} />
        {rows ? (
          <textarea
            id={id} className={`ds-input${err ? ' has-error' : ok ? ' is-valid' : ''}`}
            rows={rows} placeholder={`Nhập ${label.toLowerCase()}...`}
            value={form[id]} onChange={e => onChange(id, e.target.value)} onBlur={() => onBlur(id)}
            style={{ paddingTop: '12px', paddingBottom: '12px', resize: 'vertical', minHeight: '80px' }}
          />
        ) : (
           <input
             id={id} type={type} className={`ds-input${err ? ' has-error' : ok ? ' is-valid' : ''}`}
             placeholder={`Nhập ${label.toLowerCase()}...`}
             value={form[id]} onChange={e => onChange(id, e.target.value)} onBlur={() => onBlur(id)}
           />
        )}
        {ok && !rows && <CheckCircle2 size={15} color="#059669" style={{ position: 'absolute', right: 12, pointerEvents: 'none' }} />}
      </div>
      {err && <div className="ds-field-error"><AlertCircle size={11} /> {err}</div>}
    </div>
  );
};

const Checkout = () => {
  const { user, loading: authLoading }        = useAuth();
  const { cartItems, loadingCart, fetchCart } = useCart();
  const navigate      = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [payMethod,  setPayMethod]   = useState('ONLINE');
  const [errors,     setErrors]     = useState({});
  const [touched,    setTouched]    = useState({});

  const [form, setForm] = useState({
    ten_nguoi_nhan:    user?.ten_dang_nhap || '',
    sdt_nguoi_nhan:    user?.so_dien_thoai || '',
    dia_chi_giao_hang: user?.dia_chi || '',
    ghi_chu: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { toast.error('Vui lòng đăng nhập'); navigate('/login'); }
  }, [user, authLoading, navigate]);

  const valField = (k, v) => validators[k] ? validators[k](v) : '';

  const validateAll = () => {
    const errs = {};
    Object.keys(validators).forEach(k => {
      const e = valField(k, form[k]);
      if (e) errs[k] = e;
    });
    setErrors(errs);
    setTouched({ ten_nguoi_nhan: true, sdt_nguoi_nhan: true, dia_chi_giao_hang: true });
    return Object.keys(errs).length === 0;
  };

  const handleChange = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (touched[k]) setErrors(p => ({ ...p, [k]: valField(k, v) }));
  };

  const handleBlur = (k) => {
    setTouched(p => ({ ...p, [k]: true }));
    setErrors(p => ({ ...p, [k]: valField(k, form[k]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) { toast.error('Vui lòng kiểm tra lại thông tin'); return; }
    if (cartItems.length === 0) { toast.error('Giỏ hàng trống'); return; }

    setSubmitting(true);
    try {
      const payload = {
        ho_ten: form.ten_nguoi_nhan,
        so_dien_thoai: form.sdt_nguoi_nhan,
        dia_chi: form.dia_chi_giao_hang,
        ghi_chu: form.ghi_chu,
        phuong_thuc_thanh_toan: payMethod === 'ONLINE' ? 'transfer' : 'cod'
      };
      await orderAPI.checkout(payload);
      await fetchCart();
      toast.success('Đặt hàng thành công!');
      navigate('/confirm');
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi đặt hàng';
      const apiErrors = err.response?.data?.errors;
      toast.error(apiErrors ? Object.values(apiErrors)[0]?.[0] : msg);
    } finally { setSubmitting(false); }
  };

  const total = cartItems.reduce((s, i) => s + parseFloat(i.thanh_tien || 0), 0);



  return (
    <div className="ds-page">
      <div className="ds-wrap">
        <div className="ds-page-hd">
          <h1 className="ds-page-title"><ShoppingCart size={22} /> Thanh toán</h1>
        </div>

        <form onSubmit={handleSubmit} id="ck-form" noValidate className="ck-layout">
          {/* LEFT COL */}
          <div className="ck-col-main">
            {/* Delivery Info */}
            <div className="ds-card" style={{ marginBottom: '1.25rem' }}>
              <h2 className="ds-card-title"><MapPin size={16} /> Thông tin giao hàng</h2>
              <div className="ck-card-bd">
                <Field id="ten_nguoi_nhan" label="Họ và tên người nhận" ico={User} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                <Field id="sdt_nguoi_nhan" label="Số điện thoại"        ico={Phone} type="tel" form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                <Field id="dia_chi_giao_hang" label="Địa chỉ giao hàng" ico={MapPin} rows={3} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
                <Field id="ghi_chu"         label="Ghi chú đơn hàng"    ico={MessageSquare} rows={2} form={form} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="ds-card">
              <h2 className="ds-card-title"><CreditCard size={16} /> Phương thức thanh toán</h2>
              <div className="ck-pay-bd">
                <label className={`ck-pay-opt${payMethod === 'ONLINE' ? ' active' : ''}`}>
                  <input
                    type="radio" name="pay" checked={payMethod === 'ONLINE'}
                    onChange={() => setPayMethod('ONLINE')} className="ck-pay-radio"
                  />
                  <span className="ck-pay-emoji">🏦</span>
                  <div className="ck-pay-txt">
                    <strong>Chuyển khoản / QR Code</strong>
                    <span>Quét mã thanh toán nhanh chóng</span>
                  </div>
                  {payMethod === 'ONLINE' && <CheckCircle2 size={18} color="#059669" className="ck-pay-chk" />}
                </label>

                <label className={`ck-pay-opt${payMethod === 'COD' ? ' active' : ''}`}>
                  <input
                    type="radio" name="pay" checked={payMethod === 'COD'}
                    onChange={() => setPayMethod('COD')} className="ck-pay-radio"
                  />
                  <span className="ck-pay-emoji">🚚</span>
                  <div className="ck-pay-txt">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Trả tiền mặt cho shipper</span>
                  </div>
                  {payMethod === 'COD' && <CheckCircle2 size={18} color="#059669" className="ck-pay-chk" />}
                </label>

                {/* QR Code box */}
                {payMethod === 'ONLINE' && (
                  <div className="ck-qr-box">
                    <p className="ck-qr-hdr">Mã QR Thanh Toán</p>
                    <img
                      src={`https://img.vietqr.io/image/MB-0948342040-compact2.jpg?amount=${Math.round(total)}&addInfo=Thanh+toan+BookOne&accountName=VO+THAI+ANH`}
                      alt="QR" className="ck-qr-img" onError={e => e.target.style.display = 'none'}
                    />
                    <div className="ck-qr-details">
                      <div className="ck-qr-row"><span>Ngân hàng</span><strong>MB Bank</strong></div>
                      <div className="ck-qr-row"><span>Số tài khoản</span><strong>0948342040</strong></div>
                      <div className="ck-qr-row"><span>Chủ tài khoản</span><strong>VO THAI ANH</strong></div>
                      <div className="ck-qr-row"><span>Số tiền</span><strong style={{ color: '#dc2626' }}>{fmt(total)}</strong></div>
                      <div className="ck-qr-row"><span>Nội dung</span><strong>Thanh toan BookOne</strong></div>
                    </div>
                  </div>
                )}
                {/* COD note */}
                {payMethod === 'COD' && (
                  <div className="ck-cod-box">
                    <Truck size={17} color="#2563eb" />
                    <span>Bạn sẽ thanh toán <strong>{fmt(total)}</strong> khi nhận hàng. Giao hàng từ 2-5 ngày làm việc.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COL (Summary) */}
          <div className="ck-col-side">
            <div className="ds-card" style={{ position: 'sticky', top: '80px' }}>
              <h2 className="ds-card-title">Tóm tắt đơn hàng</h2>
              <div className="ck-card-bd">
                {loadingCart ? (
                  <Loader size={24} className="ds-spin" style={{ margin: '2rem auto', display: 'block', color: '#1e3a5f' }} />
                ) : (
                  <div className="ck-sum-list">
                    {cartItems.map(it => (
                      <div key={it.sach_id} className="ck-sum-item">
                        <img src={it.sach?.anh_bia || 'https://picsum.photos/seed/b/50/70'} alt="cover" className="ck-sum-img"/>
                        <div className="ck-sum-info">
                          <span className="ck-sum-name">{it.sach?.ten_sach}</span>
                          <span className="ck-sum-qty">Số lượng: {it.so_luong}</span>
                        </div>
                        <span className="ck-sum-price">{fmt(it.thanh_tien)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ck-sum-line" />

                <div className="ck-sum-totals">
                  <div className="ck-sum-tr"><span>Tạm tính</span><span>{fmt(total)}</span></div>
                  <div className="ck-sum-tr"><span>Phí giao hàng</span><span style={{ color: '#059669', fontWeight: 600 }}>Miễn phí</span></div>
                  <div className="ck-sum-tr ck-sum-grand"><span>Tổng cộng</span><span>{fmt(total)}</span></div>
                </div>

                <button type="submit" className="ds-btn-primary" disabled={submitting || loadingCart} style={{ marginTop: '1rem', padding: '0.85rem' }}>
                  {submitting
                    ? <><Loader size={17} className="ds-spin" /> Đang thiết lập...</>
                    : 'Xác nhận đặt hàng'
                  }
                </button>
                <Link to="/cart" className="ck-back">Quay lại giỏ hàng</Link>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .ck-layout { display: grid; grid-template-columns: 1fr 340px; gap: 1.25rem; align-items: start; }
        .ck-card-bd { padding: 1.4rem; }

        /* Payment */
        .ck-pay-bd { padding: 1.4rem; display: flex; flex-direction: column; gap: 0.8rem; }
        .ck-pay-opt {
          display: flex; align-items: center; gap: 12px;
          padding: 1rem 1.2rem; border: 1.5px solid #e9ecef;
          border-radius: 12px; cursor: pointer; transition: all .15s; background: #fafbfc;
          position: relative;
        }
        .ck-pay-opt:hover { border-color: #bfdbfe; background: #fff; }
        .ck-pay-opt.active { border-color: #2563eb; background: #eff6ff; }
        .ck-pay-radio { margin: 0; display: none; }
        .ck-pay-emoji { font-size: 1.5rem; }
        .ck-pay-txt { display: flex; flex-direction: column; gap: 2px; }
        .ck-pay-txt strong { font-size: 0.88rem; color: #111827; }
        .ck-pay-txt span   { font-size: 0.76rem; color: #6b7280; }
        .ck-pay-chk { position: absolute; right: 16px; }

        .ck-qr-box {
          margin-top: 0.5rem; background: #fff; border: 1px solid #e9ecef;
          border-radius: 12px; padding: 1.5rem; text-align: center;
        }
        .ck-qr-hdr { font-size: 0.88rem; font-weight: 700; color: #111827; margin: 0 0 1rem; }
        .ck-qr-img { width: 140px; height: 140px; border-radius: 12px; border: 1.5px solid #e9ecef; padding: 5px; margin-bottom: 1.25rem; }
        .ck-qr-details { display: flex; flex-direction: column; gap: 0.5rem; text-align: left; background: #f8fafc; padding: 1rem; border-radius: 8px; }
        .ck-qr-row { display: flex; justify-content: space-between; font-size: 0.82rem; }
        .ck-qr-row span   { color: #6b7280; }
        .ck-qr-row strong { color: #111827; font-weight: 700; }

        .ck-cod-box {
          margin-top: 0.5rem; display: flex; align-items: flex-start; gap: 10px;
          background: #eff6ff; padding: 1rem; border-radius: 10px; border: 1px solid #bfdbfe;
        }
        .ck-cod-box span { font-size: 0.84rem; color: #1e40af; line-height: 1.5; }

        /* Summary item */
        .ck-sum-list { display: flex; flex-direction: column; gap: 1rem; }
        .ck-sum-item { display: flex; gap: 12px; align-items: stretch; }
        .ck-sum-img  { width: 48px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid #f1f3f6; }
        .ck-sum-info { flex: 1; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .ck-sum-name { font-size: 0.82rem; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ck-sum-qty  { font-size: 0.75rem; color: #6b7280; margin-top: 3px; }
        .ck-sum-price { font-size: 0.85rem; font-weight: 700; color: #374151; display: flex; align-items: center; }

        .ck-sum-line { height: 1px; background: #e9ecef; margin: 1.25rem 0; }
        .ck-sum-totals { display: flex; flex-direction: column; gap: 0.6rem; }
        .ck-sum-tr { display: flex; justify-content: space-between; font-size: 0.85rem; color: #4b5563; }
        .ck-sum-grand { margin-top: 0.4rem; font-size: 1.1rem; font-weight: 900; color: #dc2626; }
        .ck-sum-grand span:first-child { color: #111827; font-size: 0.95rem; }

        .ck-back {
          display: block; text-align: center; font-size: 0.83rem;
          color: #6b7280; text-decoration: none; margin-top: 1.25rem; font-weight: 500;
        }
        .ck-back:hover { color: #1e3a5f; text-decoration: underline; }

        @media (max-width: 900px) {
          .ck-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;