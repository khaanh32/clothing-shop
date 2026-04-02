import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span>BookOne</span>
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <span className="nav-disabled">Về chúng tôi</span>
          <Link to="/" className="nav-link">Nhà xuất bản</Link>
          <Link to="/category" className="nav-link">Sản phẩm</Link>
          <span className="nav-disabled">Liên hệ</span>
        </nav>

        {/* Search & Actions */}
        <div className="header-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              className="search-input"
            />
            <Search className="search-icon" />
          </div>

          <Link to="/cart" className="cart-icon">
            <ShoppingCart style={{ width: '1.5rem', height: '1.5rem' }} />
            <span className="cart-badge">0</span>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontWeight: 500, color: '#374151' }}>Xin chào, {user.ten_dang_nhap}</span>
              <button 
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}
                title="Đăng xuất"
              >
                <LogOut style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}
          
          <Link to="/profile" style={{ color: '#4b5563' }}>
            <User style={{ width: '2rem', height: '2rem' }} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
