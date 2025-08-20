import React from 'react';
import '../assets/styles/components/HeroSection.css';
import {
  Avatar,
} from '@mui/material';
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="logo-container">
          <Avatar sx={{ m: 'auto', bgcolor: 'primary.main', width: 64, height: 64 }}>
              <DirectionsBoatIcon fontSize="large" />
            </Avatar>
        </div>
        
        <h1 className="hero-title">SmartPort AI</h1>
        <p className="hero-subtitle">
          안전과 효율성을 위한 AI 기반 스마트 항만 혁신,
          <br />
          지능형 자동화를 통한 해상 운영의 혁신적 변화.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
