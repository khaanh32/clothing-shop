import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ sach }) => {
  // Định dạng giá tiền: xx.xxx VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  return (
    <Link 
      to={`/product/${sach.id}`} 
      className="product-card"
    >
      <div className="product-img-wrapper">
        <img 
          src={sach.anh_bia || 'https://picsum.photos/seed/book/300/400'} 
          alt={sach.ten_sach}
          className="product-img"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">
          {sach.ten_sach}
        </h3>
        <p className="product-price">
          {formatPrice(sach.gia_ban || sach.gia)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
