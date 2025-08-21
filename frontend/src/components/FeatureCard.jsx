import React from 'react';
import '../assets/styles/components/FeatureCard.css';

const FeatureCard = ({ icon, iconColor, title, description }) => {
  return (
    <div className="feature-card">
      <div className={`feature-icon ${iconColor}`}>
        <span>{icon}</span>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
