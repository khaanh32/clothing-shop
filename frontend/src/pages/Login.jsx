import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    mat_khau: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate
    if (!formData.email || !formData.mat_khau) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.post('/login', {
        email: formData.email,
        mat_khau: formData.mat_khau
      });

      // 🔥 CHECK success đúng theo backend
      if (!res.data.success) {
        toast.error(res.data.message || 'Đăng nhập thất bại');
        return;
      }

      const { access_token, user } = res.data;

      // lưu login
      login(user, access_token);

      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error(error);

      // Laravel validation
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Chào mừng bạn trở lại !</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Số điện thoại hoặc Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
          />

          <input
            type="password"
            name="mat_khau"
            placeholder="Mật khẩu"
            value={formData.mat_khau}
            onChange={handleChange}
            className="auth-input"
          />
          
          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <a href="#" style={{ color: '#4b5563', fontWeight: 500 }}>
              Quên mật khẩu ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>

          {/* 🔥 ĐÃ XÓA GOOGLE LOGIN - không hỗ trợ backend */}
          
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản ?{' '}
            <Link to="/register" style={{ fontWeight: 'bold', color: '#2563eb' }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;