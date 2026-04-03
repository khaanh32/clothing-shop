import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Giỏ hàng' },
    { id: 2, label: 'Thanh toán' },
    { id: 3, label: 'Xác nhận' }
  ];

  return (
    <div className="step-indicator-container">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="step-item">
            <div className={`step-circle ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
              {currentStep > step.id ? <Check size={20} /> : step.id}
            </div>
            <span className={`step-label ${currentStep >= step.id ? 'active' : ''}`}>{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > step.id ? 'active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
