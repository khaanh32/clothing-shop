import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, BookOpen } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  return (
    <footer className="ft3-root">

      {/* ── Main grid ── */}
      <div className="ft3-container">
        <div className="ft3-grid">

          {/* Cột 1: Thương hiệu */}
          <div className="ft3-col ft3-brand-col">
            <Link to="/" className="ft3-logo">
              <div className="ft3-logo-ico"><BookOpen size={16} strokeWidth={2.5} /></div>
              <span className="ft3-logo-name">BookOne</span>
            </Link>
            <p className="ft3-brand-desc">
              Nhà sách trực tuyến uy tín — Giao hàng tận nơi, đổi trả dễ dàng. Sách chính hãng từ các nhà xuất bản lớn trong và ngoài nước.
            </p>
            <div className="ft3-social">
              <a href="#" aria-label="Facebook" className="ft3-soc-btn"><Facebook size={16} /></a>
              <a href="#" aria-label="YouTube" className="ft3-soc-btn"><Youtube size={16} /></a>
              <a href="#" aria-label="Instagram" className="ft3-soc-btn"><Instagram size={16} /></a>
            </div>
          </div>

          {/* Cột 2: Cửa hàng */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Cửa hàng</h4>
            <ul className="ft3-links">
              <li><Link to="/category">Sản phẩm mới</Link></li>
              <li><Link to="/category">Bán chạy nhất</Link></li>
              <li><Link to="/category">Sách Tiểu Thuyết</Link></li>
              <li><Link to="/category">Sách Lập Trình</Link></li>
              <li><Link to="/category">Sách Kinh Tế</Link></li>
              <li><Link to="/category">Sách Kỹ Năng</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Hỗ trợ</h4>
            <ul className="ft3-links">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="ft3-col">
            <h4 className="ft3-col-title">Liên hệ</h4>
            <ul className="ft3-contact">
              <li>
                <MapPin size={14} className="ft3-ico" />
                <span>180 Cao Lỗ, Phường Chánh Hưng, Quận 8, TP. Hồ Chí Minh</span>
              </li>
              <li>
                <Phone size={14} className="ft3-ico" />
                <span>+84 917-580-880</span>
              </li>
              <li>
                <Mail size={14} className="ft3-ico" />
                <span>vothaianhth137@gmail.com</span>
              </li>
            </ul>
            <p className="ft3-hours">Thứ 2 – Chủ nhật: 8:00 – 21:00</p>
          </div>

          {/* Cột 5: Đăng ký email */}
          <div className="ft3-col ft3-nl-col">
            <h4 className="ft3-col-title">Nhận ưu đãi</h4>
            <p className="ft3-nl-desc">Đăng ký email để nhận thông tin sách mới và mã giảm giá độc quyền mỗi tuần.</p>
            
            <div className="ft3-badges">
              <span className="ft3-badge">COD</span>
              <span className="ft3-badge">Chuyển khoản</span>
              <span className="ft3-badge">Bảo mật SSL</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft3-bottom">
        <div className="ft3-bottom-inner">
          <span>© 2025 BookOne. Thiết kế bởi Nguyễn Trí Cương &amp; Võ Thái Anh.</span>
          <div className="ft3-bottom-links">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <Link to="/contact">Liên hệ</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Root ── */
        .ft3-root {
          background: #fff;
          border-top: 1px solid #e9ecef;
          margin-top: auto;
        }

        /* ── Container ── */
        .ft3-container { max-width: 1220px; margin: 0 auto; padding: 0 1.5rem; }

        /* ── Grid ── */
        .ft3-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr 1.4fr;
          gap: 2.5rem;
          padding: 2.75rem 0 2.25rem;
          border-bottom: 1px solid #e9ecef;
        }

        /* ── Logo ── */
        .ft3-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; margin-bottom: 0.9rem;
        }
        .ft3-logo-ico {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #1e3a5f, #2563eb);
          color: #fff; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ft3-logo-name {
          font-size: 1rem; font-weight: 900; color: #1e3a5f;
          letter-spacing: -0.3px;
        }

        /* ── Brand col ── */
        .ft3-brand-desc {
          font-size: 0.8rem; color: #64748b; line-height: 1.7; margin-bottom: 1rem;
        }
        .ft3-social { display: flex; gap: 0.5rem; }
        .ft3-soc-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f1f3f6; color: #374151;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all .15s;
        }
        .ft3-soc-btn:hover { background: #1e3a5f; color: #fff; }

        /* ── Col title ── */
        .ft3-col-title {
          font-size: 0.88rem; font-weight: 800; color: #111827;
          margin-bottom: 0.9rem; text-transform: uppercase; letter-spacing: 0.4px;
        }

        /* ── Links ── */
        .ft3-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .ft3-links a { font-size: 0.82rem; color: #6b7280; text-decoration: none; transition: color .15s; }
        .ft3-links a:hover { color: #1e3a5f; }

        /* ── Contact ── */
        .ft3-contact { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.7rem; }
        .ft3-contact li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.8rem; color: #6b7280; line-height: 1.5; }
        .ft3-ico { color: #94a3b8; flex-shrink: 0; margin-top: 2px; }
        .ft3-hours { margin-top: 0.75rem; font-size: 0.78rem; color: #6b7280; }

        /* ── Newsletter col ── */
        .ft3-nl-desc { font-size: 0.8rem; color: #6b7280; line-height: 1.65; margin-bottom: 0.9rem; }
        .ft3-nl-form { display: flex; gap: 0.4rem; margin-bottom: 0.85rem; }
        .ft3-nl-inp {
          flex: 1; padding: 0.55rem 0.8rem;
          border: 1.5px solid #e2e8f0; border-radius: 7px;
          font-size: 0.8rem; outline: none; transition: border-color .15s;
          background: #f8fafc;
        }
        .ft3-nl-inp:focus { border-color: #2563eb; background: #fff; }
        .ft3-nl-btn {
          padding: 0.55rem 0.85rem; background: #1e3a5f; color: #fff;
          font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer;
          border-radius: 7px; transition: background .15s; white-space: nowrap;
        }
        .ft3-nl-btn:hover { background: #2563eb; }
        .ft3-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .ft3-badge {
          padding: 3px 9px; border-radius: 5px;
          background: #f1f5f9; color: #475569;
          font-size: 0.72rem; font-weight: 700; border: 1px solid #e2e8f0;
        }

        /* ── Bottom bar ── */
        .ft3-bottom { background: #f8fafc; border-top: 1px solid #e9ecef; }
        .ft3-bottom-inner {
          max-width: 1220px; margin: 0 auto; padding: 0.9rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
        }
        .ft3-bottom span { font-size: 0.78rem; color: #94a3b8; }
        .ft3-bottom-links { display: flex; gap: 1.25rem; }
        .ft3-bottom-links a { font-size: 0.78rem; color: #94a3b8; text-decoration: none; transition: color .15s; }
        .ft3-bottom-links a:hover { color: #1e3a5f; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ft3-grid { grid-template-columns: 1fr 1fr 1fr; }
          .ft3-brand-col { grid-column: 1 / -1; }
          .ft3-nl-col { grid-column: span 2; }
        }
        @media (max-width: 640px) {
          .ft3-grid { grid-template-columns: 1fr 1fr; gap: 1.75rem; padding: 2rem 0 1.5rem; }
          .ft3-nl-col { grid-column: 1 / -1; }
        }
        @media (max-width: 440px) {
          .ft3-grid { grid-template-columns: 1fr; }
          .ft3-bottom-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
