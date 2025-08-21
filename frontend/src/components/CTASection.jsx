import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/CTASection.css';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">항만 운영을 혁신할 준비가 되셨나요?</h2>
        <p className="cta-subtitle">AI 기반 솔루션으로 해상 기술의 미래에 동참하세요</p>
        <button className="cta-button" onClick={handleGetStarted}>
          지금 시작하기
        </button>
      </div>
    </section>
  );
};

export default CTASection;
