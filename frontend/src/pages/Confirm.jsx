import React from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';

const Confirm = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light">
      <div className="page-container">
        <StepIndicator currentStep={3} />
        
        <div className="checkout-layout">
          <div className="checkout-left">
            <div className="card checkout-form-card">
              <h2 className="card-title">Thông tin thanh toán</h2>
              <div className="checkout-form">
                <div className="readonly-input">VO THAI ANH</div>
                <div className="readonly-input">0948342040</div>
                <div className="readonly-input">180 Cao Lỗ, Q8, TP. HCM</div>
                
                <div className="payment-methods" style={{ opacity: 0.7 }}>
                  <label className="radio-label">
                    <input type="radio" checked readOnly />
                    <span className="radio-custom"></span>
                    Chuyển khoản ngân hàng
                  </label>
                  <label className="radio-label">
                    <input type="radio" disabled />
                    <span className="radio-custom"></span>
                    Thanh toán khi nhận hàng
                  </label>
                </div>
              </div>
            </div>

            <div className="card success-msg-card">
              <p className="success-text">Đã xác nhận thanh toán thành công !</p>
              <p className="success-text">Vui lòng xác nhận đặt hàng.</p>
            </div>
            
            <button onClick={() => navigate('/')} className="btn-primary full-width" style={{ marginTop: '1rem' }}>
              Xác nhận đặt hàng →
            </button>
          </div>
          
          <div className="checkout-right">
            {/* Empty right side in the third image */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
