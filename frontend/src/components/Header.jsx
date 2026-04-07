import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import {
  Search, ShoppingCart, User, LogOut,
  Package, ChevronDown, Menu, X, BookOpen,
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const navigate         = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchVal,    setSearchVal]    = useState('');
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout  = () => { logout(); setDropdownOpen(false); navigate('/login'); };
  const handleSearch  = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchVal.trim())}`);
      setMobileOpen(false);
    }
  };
  const getInits = (n) => (n ? n.charAt(0).toUpperCase() : 'U');
  const closeM   = () => setMobileOpen(false);

  return (
    <header className={`hd4-root${scrolled ? ' hd4-shadow' : ''}`}>

      {/* ══════════ MAIN BAR ══════════ */}
      <div className="hd4-bar">
        <div className="hd4-inner">

          {/* Mobile hamburger */}
          <button className="hd4-hamburger" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* LOGO */}
          <Link to="/" className="hd4-logo" onClick={closeM}>
            <div className="hd4-logo-ico">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div className="hd4-logo-txt">
              <span className="hd4-logo-brand">BookOne</span>
              <span className="hd4-logo-tag">Thế giới sách</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hd4-nav">
            <Link to="/"        className="hd4-nav-a">Trang chủ</Link>
            <Link to="/about"   className="hd4-nav-a">Về chúng tôi</Link>
            <Link to="/category" className="hd4-nav-a">Sản phẩm</Link>
            <Link to="/contact" className="hd4-nav-a">Liên hệ</Link>
          </nav>

          {/* SEARCH – desktop */}
          <form className="hd4-search" onSubmit={handleSearch}>
            <Search size={16} className="hd4-search-ico" />
            <input
              id="header-search"
              type="text"
              placeholder="Tìm sách, tác giả, thể loại..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="hd4-search-inp"
            />
            {searchVal && (
              <button
                type="button"
                className="hd4-search-clear"
                onClick={() => setSearchVal('')}
              ><X size={13} /></button>
            )}
          </form>

          {/* RIGHT ACTIONS */}
          <div className="hd4-right">

            {/* Giỏ hàng */}
            <Link to="/cart" className="hd4-icon-btn" aria-label="Giỏ hàng" id="cart-btn">
              <ShoppingCart size={21} />
              {cartCount > 0 && <span className="hd4-badge">{cartCount}</span>}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hd4-av-wrap" ref={dropdownRef}>
                <button
                  className="hd4-av-btn"
                  onClick={() => setDropdownOpen(p => !p)}
                  id="avatar-trigger"
                >
                  <div className="hd4-av-circle">{getInits(user.ten_dang_nhap)}</div>
                  <span className="hd4-av-name">{user.ten_dang_nhap}</span>
                  <ChevronDown
                    size={13}
                    style={{ color: '#6b7280', transition: 'transform .2s',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {dropdownOpen && (
                  <div className="hd4-dd">
                    {/* User info */}
                    <div className="hd4-dd-info">
                      <div className="hd4-dd-av">{getInits(user.ten_dang_nhap)}</div>
                      <div>
                        <div className="hd4-dd-uname">{user.ten_dang_nhap}</div>
                        <div className="hd4-dd-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="hd4-dd-line" />
                    <Link to="/profile" className="hd4-dd-item" onClick={() => setDropdownOpen(false)} id="profile-link">
                      <User size={15} /> Thông tin cá nhân
                    </Link>
                    <Link to="/orders" className="hd4-dd-item" onClick={() => setDropdownOpen(false)} id="orders-link">
                      <Package size={15} /> Đơn hàng của tôi
                    </Link>
                    <div className="hd4-dd-line" />
                    <button className="hd4-dd-item hd4-dd-logout" onClick={handleLogout} id="logout-btn">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hd4-login-btn" id="login-btn">
                <User size={17} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div className={`hd4-mob${mobileOpen ? ' open' : ''}`}>
        {/* Mobile search */}
        <div className="hd4-mob-search-wrap">
          <form className="hd4-mob-search" onSubmit={handleSearch}>
            <Search size={15} className="hd4-mob-search-ico" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="hd4-mob-search-inp"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </form>
        </div>

        {/* Mobile nav */}
        <nav className="hd4-mob-nav">
          <Link to="/"         className="hd4-mob-a" onClick={closeM}>🏠 Trang chủ</Link>
          <Link to="/category" className="hd4-mob-a" onClick={closeM}>📚 Sản phẩm</Link>
          <Link to="/about"    className="hd4-mob-a" onClick={closeM}>ℹ️ Về chúng tôi</Link>
          <Link to="/contact"  className="hd4-mob-a" onClick={closeM}>📞 Liên hệ</Link>
          {user && <>
            <Link to="/profile" className="hd4-mob-a" onClick={closeM}>👤 Tài khoản</Link>
            <Link to="/orders"  className="hd4-mob-a" onClick={closeM}>📦 Đơn hàng</Link>
            <button className="hd4-mob-a hd4-mob-logout" onClick={() => { handleLogout(); closeM(); }}>
              🚪 Đăng xuất
            </button>
          </>}
          {!user && (
            <Link to="/login" className="hd4-mob-a hd4-mob-login" onClick={closeM}>Đăng nhập</Link>
          )}
        </nav>
      </div>

      {/* ══════════ STYLES ══════════ */}
      <style>{`
        /* Root */
        .hd4-root {
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          position: sticky; top: 0; z-index: 1000;
          transition: box-shadow .25s;
        }
        .hd4-shadow { box-shadow: 0 2px 16px rgba(0,0,0,0.10); }

        /* Main bar */
        .hd4-bar { width: 100%; }
        .hd4-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 1.5rem; height: 66px;
          display: flex; align-items: center; gap: 1.5rem;
        }

        /* Logo */
        .hd4-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .hd4-logo-ico {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
          display: flex; align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 3px 10px rgba(37,99,235,0.3);
        }
        .hd4-logo-txt { display: flex; flex-direction: column; line-height: 1.2; }
        .hd4-logo-brand {
          font-size: 1.2rem; font-weight: 900; letter-spacing: -0.5px;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hd4-logo-tag {
          font-size: 0.66rem; font-weight: 500; color: #94a3b8; letter-spacing: 0.4px;
        }

        /* Desktop nav */
        .hd4-nav { display: flex; align-items: center; gap: 0.25rem; flex-shrink: 0; }
        .hd4-nav-a {
          padding: 0.45rem 0.85rem;
          font-size: 0.94rem; font-weight: 600;
          color: #374151; text-decoration: none;
          border-radius: 8px; transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .hd4-nav-a:hover { background: #f0f4ff; color: #1e3a5f; }

        /* Search */
        .hd4-search {
          flex: 1; max-width: 360px;
          position: relative; display: flex; align-items: center;
        }
        .hd4-search-ico {
          position: absolute; left: 12px; color: #9ca3af; pointer-events: none;
        }
        .hd4-search-inp {
          width: 100%;
          padding: 0.55rem 2rem 0.55rem 2.4rem;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 0.88rem; background: #f8fafc; outline: none;
          transition: border-color .2s, background .2s;
          color: #111827;
        }
        .hd4-search-inp::placeholder { color: #b0b8c4; }
        .hd4-search-inp:focus { border-color: #2563eb; background: #fff; }
        .hd4-search-clear {
          position: absolute; right: 10px; background: none; border: none;
          color: #9ca3af; cursor: pointer; display: flex; align-items: center;
          padding: 2px; transition: color .15s;
        }
        .hd4-search-clear:hover { color: #374151; }

        /* Right actions */
        .hd4-right {
          display: flex; align-items: center; gap: 0.6rem;
          margin-left: auto; flex-shrink: 0;
        }

        /* Cart icon */
        .hd4-icon-btn {
          position: relative; color: #374151;
          display: flex; align-items: center;
          padding: 0.45rem; border-radius: 9px;
          transition: background .15s, color .15s; text-decoration: none;
        }
        .hd4-icon-btn:hover { background: #f0f4ff; color: #1e3a5f; }
        .hd4-badge {
          position: absolute; top: 0px; right: 0px;
          background: #dc2626; color: #fff;
          font-size: 0.6rem; font-weight: 800;
          min-width: 17px; height: 17px;
          border-radius: 999px; display: flex; align-items: center; justify-content: center;
          padding: 0 3px; border: 2px solid #fff;
        }

        /* Login button */
        .hd4-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0.5rem 1.1rem;
          border: 2px solid #1e3a5f; border-radius: 9px;
          color: #1e3a5f; font-size: 0.88rem; font-weight: 700;
          text-decoration: none; transition: all .15s;
          white-space: nowrap;
        }
        .hd4-login-btn:hover { background: #1e3a5f; color: #fff; }

        /* Avatar */
        .hd4-av-wrap { position: relative; }
        .hd4-av-btn {
          display: flex; align-items: center; gap: 7px;
          background: none; border: none; cursor: pointer;
          padding: 0.4rem 0.7rem; border-radius: 9px;
          transition: background .15s;
        }
        .hd4-av-btn:hover { background: #f3f4f6; }
        .hd4-av-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          color: #fff; font-size: 0.78rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .hd4-av-name {
          font-size: 0.88rem; font-weight: 600; color: #111827;
          max-width: 90px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
        }

        /* Dropdown */
        .hd4-dd {
          position: absolute; top: calc(100% + 8px); right: 0;
          background: #fff; border: 1px solid #e5e7eb; border-radius: 14px;
          box-shadow: 0 10px 32px rgba(0,0,0,0.13);
          min-width: 220px; z-index: 200; overflow: hidden;
        }
        .hd4-dd-info { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
        .hd4-dd-av {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          color: #fff; font-size: 0.85rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .hd4-dd-uname { font-size: 0.9rem; font-weight: 700; color: #111827; }
        .hd4-dd-email { font-size: 0.75rem; color: #6b7280; }
        .hd4-dd-line { height: 1px; background: #f1f5f9; }
        .hd4-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 16px; font-size: 0.88rem; color: #374151; font-weight: 500;
          text-decoration: none; background: none; border: none;
          cursor: pointer; width: 100%; text-align: left; transition: background .15s;
        }
        .hd4-dd-item:hover { background: #f8fafc; }
        .hd4-dd-logout { color: #dc2626; font-weight: 600; }
        .hd4-dd-logout:hover { background: #fff5f5; }

        /* Hamburger */
        .hd4-hamburger {
          display: none; background: none; border: none;
          cursor: pointer; color: #374151; padding: 4px; flex-shrink: 0;
          border-radius: 8px; transition: background .15s;
        }
        .hd4-hamburger:hover { background: #f3f4f6; }

        /* Mobile menu */
        .hd4-mob {
          display: none; max-height: 0; overflow: hidden;
          transition: max-height .3s ease;
          background: #fff; border-top: 1px solid #f1f5f9;
        }
        .hd4-mob.open { max-height: 600px; }
        .hd4-mob-search-wrap { padding: 0.75rem 1.25rem 0.5rem; }
        .hd4-mob-search {
          position: relative; display: flex; align-items: center;
        }
        .hd4-mob-search-ico { position: absolute; left: 12px; color: #9ca3af; pointer-events: none; }
        .hd4-mob-search-inp {
          width: 100%; padding: 0.6rem 1rem 0.6rem 2.4rem;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-size: 0.88rem; background: #f8fafc; outline: none;
        }
        .hd4-mob-nav {
          display: flex; flex-direction: column; padding: 0.4rem 1rem 1rem;
        }
        .hd4-mob-a {
          padding: 0.7rem 0.5rem; font-size: 0.96rem; font-weight: 500; color: #374151;
          text-decoration: none; background: none; border: none;
          border-bottom: 1px solid #f3f4f6; cursor: pointer; text-align: left; display: block;
          transition: color .15s;
        }
        .hd4-mob-a:hover { color: #1e3a5f; }
        .hd4-mob-a:last-child { border-bottom: none; }
        .hd4-mob-logout { color: #dc2626; font-weight: 600; }
        .hd4-mob-login {
          margin-top: 0.5rem; text-align: center;
          background: #1e3a5f; color: #fff !important;
          border-radius: 10px; font-weight: 700; padding: 0.75rem;
          border-bottom: none !important;
        }

        /* Responsive */
        @media (max-width: 960px) {
          .hd4-nav { display: none; }
          .hd4-search { display: none; }
          .hd4-hamburger { display: flex; }
          .hd4-mob { display: block; }
          .hd4-av-name { display: none; }
          .hd4-login-btn span { display: none; }
          .hd4-login-btn { padding: 0.45rem; border-radius: 9px; }
        }
        @media (max-width: 480px) {
          .hd4-inner { height: 58px; padding: 0 1rem; gap: 0.75rem; }
          .hd4-logo-tag { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
