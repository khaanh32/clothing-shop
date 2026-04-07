import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Loader, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth(); // Assuming login function updates auth context or we can refresh user
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    so_dien_thoai: '',
    dia_chi: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      // Set temporary data from context
      setFormData({
        ten_dang_nhap: user.ten_dang_nhap || '',
        so_dien_thoai: user.so_dien_thoai || '',
        dia_chi: user.dia_chi || '',
        email: user.email || '',
      });
      // Fetch fresh data
      userAPI.getProfile(user.id).then(res => {
        const freshUser = res.data?.data || res.data;
        if (freshUser) {
          setFormData({
            ten_dang_nhap: freshUser.ten_dang_nhap || '',
            so_dien_thoai: freshUser.so_dien_thoai || '',
            dia_chi: freshUser.dia_chi || '',
            email: freshUser.email || '',
          });
        }
      }).catch(err => console.log('Có lỗi khi lấy fresh profile', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Send only fields that are editable based on backend requirements
      // Mat khau is not sent here
      const res = await userAPI.updateProfile(user.id, {
        ten_dang_nhap: formData.ten_dang_nhap,
        so_dien_thoai: formData.so_dien_thoai,
        dia_chi: formData.dia_chi
      });
      toast.success('Đã cập nhật thông tin thành công!');
      
      // Attempt to update local context if API returns new user data
      if (res.data?.data) {
         // Keep old access token, update user object
         const token = localStorage.getItem('access_token');
         if (token) login(res.data.data, token); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="usr-root-premium ds-page">
      <div className="usr-container">
        <div className="ds-card profile-card-premium shadow-2xl">
          {/* Header Section with Avatar */}
          <div className="profile-header-premium">
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                {formData.ten_dang_nhap ? formData.ten_dang_nhap.charAt(0).toUpperCase() : <User size={32} />}
              </div>
              
            </div>
            <h1 className="profile-name-premium">{formData.ten_dang_nhap || 'Người dùng'}</h1>
            <p className="profile-email-premium">{formData.email}</p>
          </div>

          <div className="profile-body-premium">
            <form onSubmit={handleSubmit} className="profile-form-compact">
              <div className="profile-grid">
                {/* Tên đăng nhập */}
                <div className="ds-field-compact">
                  <label className="ds-label-compact">
                    <User size={14} className="label-icon" /> Tên hiển thị
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="text"
                      className="ds-input-refined"
                      value={formData.ten_dang_nhap}
                      onChange={(e) => setFormData({...formData, ten_dang_nhap: e.target.value})}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="ds-field-compact">
                  <label className="ds-label-compact">
                    <Phone size={14} className="label-icon" /> Số điện thoại
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="tel"
                      className="ds-input-refined"
                      value={formData.so_dien_thoai}
                      onChange={(e) => setFormData({...formData, so_dien_thoai: e.target.value})}
                      placeholder="0901 234 567"
                      required
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div className="ds-field-compact field-full">
                  <label className="ds-label-compact">
                    <Mail size={14} className="label-icon" /> Địa chỉ Email
                  </label>
                  <div className="ds-input-wrap">
                    <input
                      type="email"
                      className="ds-input-refined input-disabled"
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="ds-field-compact field-full">
                  <label className="ds-label-compact">
                    <MapPin size={14} className="label-icon" /> Địa chỉ giao hàng
                  </label>
                  <div className="ds-input-wrap">
                    <textarea
                      className="ds-input-refined area-refined"
                      rows={2}
                      value={formData.dia_chi}
                      onChange={(e) => setFormData({...formData, dia_chi: e.target.value})}
                      placeholder="Số nhà, tên đường, phường/xã..."
                      required
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="ds-btn-primary ds-btn-pill premium-btn-full"
                disabled={loading}
              >
                {loading ? <Loader size={18} className="ds-spin" /> : <>Lưu thay đổi</>}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .usr-root-premium {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }
        .usr-root-premium::before {
          content: "";
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(30, 58, 95, 0.03) 0%, transparent 70%);
          top: -200px; left: -200px;
        }
        .usr-container {
          width: 100%;
          max-width: 520px;
          z-index: 10;
        }
        .profile-card-premium {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.08);
        }
        .profile-header-premium {
          text-align: center;
          margin-bottom: 2rem;
        }
        .avatar-wrapper {
          position: relative;
          width: 80px; height: 80px;
          margin: 0 auto 1.25rem;
        }
        .avatar-circle {
          width: 100%; height: 100%;
          background: #1e3a5f;
          color: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          box-shadow: 0 10px 20px -5px rgba(30, 58, 95, 0.3);
          transform: rotate(-3deg);
        }
        .avatar-badge {
          position: absolute;
          bottom: -4px; right: -4px;
          background: #10b981;
          color: white;
          width: 24px; height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .profile-name-premium {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0.25rem;
        }
        .profile-email-premium {
          color: #64748b;
          font-size: 0.875rem;
        }
        .profile-form-compact {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .field-full {
          grid-column: span 2;
        }
        .ds-field-compact {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .ds-label-compact {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #475569;
          margin-left: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .label-icon {
          color: #94a3b8;
        }
        .ds-input-refined {
          width: 100%;
          border-radius: 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }
        .ds-input-refined:focus {
          background: #ffffff;
          border-color: #1e3a5f;
          box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.05);
          outline: none;
        }
        .input-disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          color: #94a3b8;
        }
        .area-refined {
          resize: none;
          min-height: 80px;
        }
        .premium-btn-full {
          width: 100%;
          background: #1e3a5f;
          color: white;
          padding: 0.875rem;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 20px -5px rgba(30, 58, 95, 0.25);
        }
        .premium-btn-full:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(30, 58, 95, 0.35);
        }
        .premium-btn-full:active {
          transform: translateY(0);
        }
        .premium-btn-full:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .ds-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .field-full {
            grid-column: span 1;
          }
          .profile-card-premium {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
