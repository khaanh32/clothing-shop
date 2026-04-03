import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: '',
    mat_khau_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mat_khau !== formData.mat_khau_confirmation) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/register', formData);
      toast.success(response.data.message || 'Đăng ký thành công!');
      navigate('/login'); // Chuyển hướng sang trang đăng nhập
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      if (error.response?.data?.errors) {
        // Lấy lỗi đầu tiên từ validation của Laravel
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error('Đăng ký thất bại, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Đăng ký tài khoản</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="ten_dang_nhap" placeholder="Tên đăng nhập" value={formData.ten_dang_nhap} onChange={handleChange} className="auth-input" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="auth-input" required />
          <input type="text" name="so_dien_thoai" placeholder="Số điện thoại" value={formData.so_dien_thoai} onChange={handleChange} className="auth-input" required />
          <input type="text" name="dia_chi" placeholder="Địa chỉ" value={formData.dia_chi} onChange={handleChange} className="auth-input" required />
          <input type="password" name="mat_khau" placeholder="Mật khẩu (Tối thiểu 6 ký tự)" value={formData.mat_khau} onChange={handleChange} className="auth-input" required minLength="6" />
          <input type="password" name="mat_khau_confirmation" placeholder="Xác nhận mật khẩu" value={formData.mat_khau_confirmation} onChange={handleChange} className="auth-input" required />
          
          <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop: '1rem' }}>
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login" style={{ fontWeight: 'bold', color: '#2563eb' }}>Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;