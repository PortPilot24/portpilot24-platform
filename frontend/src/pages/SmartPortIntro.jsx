import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';
import '../assets/styles/SmartPortIntro.css';

const SmartPortIntro = () => {
  const featuresData = [
    {
      id: 1,
      icon: '🦺',
      iconColor: 'red',
      title: '안전장비 감지',
      description: 'AI 기반 컴퓨터 비전을 통해 실시간으로 안전장비 착용을 감지하여 지능형 모니터링 시스템을 통한 작업자 안전을 보장합니다.'
    },
    {
      id: 2,
      icon: '📋',
      iconColor: 'blue',
      title: '항만 규정 안내 Agent',
      description: '항만법, 위험물 적재·포장 등 항만 관련 규정에 대해 벡터DB 기반 자연어 응답을 제공하며, 실시간 정보와 법령 데이터를 바탕으로 체크리스트 형태의 대응 절차를 생성합니다.'
    },
    {
      id: 3,
      icon: '📦',
      iconColor: 'green',
      title: '컨테이너 모니터링',
      description: '지능형 알림과 함께 실시간 컨테이너 추적 및 모니터링을 통해 효율적인 화물 관리를 위한 포괄적인 가시성을 제공합니다.'
    },
    {
      id: 4,
      icon: '📄',
      iconColor: 'purple',
      title: '문서 분류',
      description: '해상 문서의 자동화된 처리, 정리 및 관리를 위한 고급 AI 문서 분류 시스템으로 효율적인 문서 업무를 지원합니다.'
    },
    {
      id: 5,
      icon: '📊',
      iconColor: 'orange',
      title: '컨테이너 입고량 예측',
      description: '과거 차량 수, TEU 데이터, 날씨 데이터를 통합 학습하여 차량 흐름 패턴과 TEU 수치 간 상관관계를 바탕으로 일별 컨테이너 입고량을 예측하며, 태풍·강수 등 기상 변수까지 반영한 정확한 예측을 제공합니다.'
    }
  ];

  return (
    <div className="smart-port-container">
      <HeroSection />
      
      {/* Project Overview Section */}
      <section className="overview-section">
        <div className="overview-container">
          <h2 className="overview-title">프로젝트 개요</h2>
          <p className="overview-description">
            지능적이고 안전하며 효율적인 항만 운영을 위한 혁신적인 해상 기술입니다. 
            우리의 종합 플랫폼은 안전 프로토콜, 스마트 화물 관리, 기술적 해상 솔루션을 통해 
            기업이 물류를 효율적으로 관리하고 운영 성과의 효율성 지표를 최대화할 수 있도록 지원합니다.
          </p>
          
          <div className="features-grid">
            {featuresData.map(feature => (
              <FeatureCard 
                key={feature.id}
                icon={feature.icon}
                iconColor={feature.iconColor}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default SmartPortIntro;
