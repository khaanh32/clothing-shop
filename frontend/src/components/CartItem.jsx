import React from 'react';
import { Plus, Minus, X } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove, readonly = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  // Handle both mock data and real API data structure
  const name = item.sach?.ten_sach || item.name;
  const price = item.sach?.gia_ban || item.sach?.gia || item.price;
  const image = item.sach?.anh_bia || item.image;
  const quantity = item.so_luong || item.quantity;
  const id = item.id;

  return (
    <div className="cart-item">
      <img src={image} alt={name} className="cart-item-img" referrerPolicy="no-referrer" />
      <div className="cart-item-content">
        <div className="cart-item-top">
          <h3 className="cart-item-name">{name}</h3>
          <div className="cart-item-controls">
            <div className="quantity-control">
              <span className="quantity-value">{quantity}</span>
              <div className="quantity-btns">
                <button 
                  onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity + 1)} 
                  className="qty-btn" 
                  disabled={readonly}
                >
                  <Plus size={14} />
                </button>
                <button 
                  onClick={() => onUpdateQuantity && onUpdateQuantity(id, Math.max(1, quantity - 1))} 
                  className="qty-btn" 
                  disabled={readonly}
                >
                  <Minus size={14} />
                </button>
              </div>
            </div>
            {!readonly && (
              <button onClick={() => onRemove && onRemove(id)} className="remove-btn">
                <X size={16} />
              </button>
            )}
            {readonly && (
              <button className="remove-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="cart-item-bottom">
          <p className="cart-item-price">{formatPrice(price)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
