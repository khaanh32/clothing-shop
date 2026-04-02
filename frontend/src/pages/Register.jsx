import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../axiosClient';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    email: '',
    mat_khau: '',
    mat_khau_confirmation: '',
    so_dien_thoai: '',
    dia_chi: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ten_dang_nhap || !formData.email || !formData.mat_khau || !formData.so_dien_thoai) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (formData.mat_khau !== formData.mat_khau_confirmation) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/register', formData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        // Lấy lỗi đầu tiên từ Laravel validation
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const googleUser = {
      ten_dang_nhap: decoded.name,
      email: decoded.email,
      anh_dai_dien: decoded.picture,
      provider: 'google'
    };
    login(googleUser, credentialResponse.credential);
    toast.success('Đăng ký qua Google thành công!');
    navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Đăng ký</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="ten_dang_nhap"
            placeholder="Tên đầy đủ"
            value={formData.ten_dang_nhap}
            onChange={handleChange}
            className="auth-input"
          />
          
          <input
            type="text"
            name="dia_chi"
            placeholder="Địa chỉ"
            value={formData.dia_chi}
            onChange={handleChange}
            className="auth-input"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
          />

          <input
            type="text"
            name="so_dien_thoai"
            placeholder="Số điện thoại"
            value={formData.so_dien_thoai}
            onChange={handleChange}
            className="auth-input"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="password"
              name="mat_khau"
              placeholder="Mật khẩu"
              value={formData.mat_khau}
              onChange={handleChange}
              className="auth-input"
            />
            <input
              type="password"
              name="mat_khau_confirmation"
              placeholder="Xác nhận mật khẩu"
              value={formData.mat_khau_confirmation}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>

          <div className="auth-divider">
            <div className="divider-line"></div>
            <span style={{ color: '#6b7280' }}>Hoặc</span>
            <div className="divider-line"></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Đăng ký Google thất bại')}
              theme="outline"
              shape="pill"
              text="signup_with"
              width="100%"
            />
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản ? <Link to="/login" style={{ fontWeight: 'bold', color: '#2563eb' }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
