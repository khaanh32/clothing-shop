import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Info */}
        <div className="footer-brand">
          <h3>BookOne</h3>
          <p>
            nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả hệ Thống trên toàn quốc.
          </p>
        </div>

        {/* Store Links */}
        <div className="footer-section">
          <h3>Cửa hàng</h3>
          <ul className="footer-links">
            <li><a href="#">Sản phẩm mới</a></li>
            <li><a href="#">Sản phẩm bán chạy</a></li>
            <li><a href="#">Sách tiểu Thuyết</a></li>
            <li><a href="#">Sách tâm lý</a></li>
            <li><a href="#">khuyến mãi</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h3>Công ty</h3>
          <ul className="footer-links">
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Địa chỉ công ty</a></li>
            <li><a href="#">Điều khoản</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <ul className="footer-contact">
            <li>
              <Mail style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>vothaianh137@gmail.com</span>
            </li>
            <li>
              <Phone style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>+84 917-580-860</span>
            </li>
            <li>
              <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>180 Cao Lỗ, Phường Chánh Hưng, TP. HCM</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Design by Paoo. 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
