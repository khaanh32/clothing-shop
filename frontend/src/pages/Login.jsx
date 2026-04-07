import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, BookOpen, Loader } from 'lucide-react';
import '../styles/design-system.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', mat_khau: '' });
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.mat_khau) {
      toast.error('Vui lòng nhập đầy đủ thông tin'); return;
    }
    setLoading(true);
    try {
      const res = await axiosClient.post('/login', formData);
      if (!res.data.success) { toast.error(res.data.message || 'Đăng nhập thất bại'); return; }
      login(res.data.user, res.data.access_token);
      toast.success('Đăng nhập thành công! Chào mừng trở lại!');
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors)
        toast.error(Object.values(err.response.data.errors)[0][0]);
      else
        toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root ds-page">
      <div className="auth-center">
        <div className="ds-card auth-card-premium shadow-2xl">
          {/* Logo Section */}
          <div className="auth-header-compact">
            <div className="auth-logo-box-small">
              <BookOpen size={20} className="auth-logo-icon" />
            </div>
            <h1 className="auth-title-compact">Đăng nhập</h1>
            <p className="auth-subtitle-compact">Chào mừng bạn trở lại!</p>
          </div>

          <div className="auth-body-compact">
            <form onSubmit={handleSubmit} id="login-form" className="auth-form-compact">
              {/* Email */}
              <div className="ds-field-compact">
                <label className="ds-label-compact" htmlFor="login-email">Email</label>
                <div className="ds-input-wrap">
                  <Mail size={14} className="ds-input-ico" />
                  <input
                    id="login-email" type="email" name="email"
                    placeholder="example@gmail.com"
                    value={formData.email} onChange={handleChange}
                    className="ds-input-refined" autoComplete="email" required
                  />
                </div>
              </div>
              {/* Password */}
              <div className="ds-field-compact">
                <div className="auth-label-row">
                  <label className="ds-label-compact" htmlFor="login-password">Mật khẩu</label>
                  <a href="#" className="auth-forgot-link">Quên mật khẩu?</a>
                </div>
                <div className="ds-input-wrap">
                  <Lock size={14} className="ds-input-ico" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    name="mat_khau" placeholder="Mật khẩu của bạn"
                    value={formData.mat_khau} onChange={handleChange}
                    className="ds-input-refined ds-input-pass"
                    autoComplete="current-password" required
                  />
                  <button type="button" className="auth-eye-compact"
                    onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="ds-btn-primary ds-btn-pill premium-btn" disabled={loading} id="login-submit">
                {loading
                  ? <><Loader size={16} className="ds-spin" /> Đang xử lý...</>
                  : 'Đăng nhập ngay'
                }
              </button>
            </form>

            <div className="auth-footer-compact">
              <p className="auth-switch-text">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="auth-switch-link" id="go-register">Đăng ký</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          position: relative;
          overflow: hidden;
        }
        .auth-root::before {
          content: "";
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(30, 58, 95, 0.05) 0%, transparent 70%);
          top: -100px; right: -100px;
        }
        .auth-center {
          width: 100%;
          max-width: 400px;
          padding: 1.5rem;
          z-index: 10;
        }
        .auth-card-premium {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 2.25rem 2rem;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
        }
        .auth-header-compact {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .auth-logo-box-small {
          width: 44px; height: 44px;
          background: #1e3a5f;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .auth-title-compact {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }
        .auth-subtitle-compact {
          color: #64748b;
          font-size: 0.875rem;
        }
        .auth-form-compact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem; /* Drastically reduced gap */
        }
        .ds-field-compact {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .ds-label-compact {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #334155;
          margin-left: 0.5rem;
        }
        .auth-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .auth-forgot-link {
          font-size: 0.75rem;
          color: #1e3a5f;
          text-decoration: none;
          font-weight: 500;
        }
        .ds-input-refined {
          width: 100%;
          border-radius: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          font-size: 0.9375rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ds-input-refined:focus {
          border-color: #1e3a5f;
          box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.08);
          outline: none;
        }
        .ds-input-ico {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: color 0.2s;
        }
        .ds-input-refined:focus + .ds-input-ico {
          color: #1e3a5f;
        }
        .auth-eye-compact {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
        }
        .premium-btn {
          margin-top: 0.5rem;
          padding: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 16px -4px rgba(30, 58, 95, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .premium-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px -4px rgba(30, 58, 95, 0.35);
        }
        .auth-footer-compact {
          margin-top: 1.5rem;
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }
        .auth-switch-text {
          font-size: 0.8125rem;
          color: #64748b;
        }
        .auth-switch-link {
          color: #1e3a5f;
          font-weight: 700;
          text-decoration: none;
        }
        .auth-switch-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;