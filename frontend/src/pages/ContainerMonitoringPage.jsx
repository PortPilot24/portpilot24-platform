// frontend/src/pages/ContainerMonitoringPage.jsx
import React, { useEffect, useState } from 'react';
import PredictedOccupancyChart from './PredictedOccupancyChart';
import PredictedOccupancySummary from './PredictedOccupancySummary';
import { Link } from 'react-router-dom';
import { fdClient } from '../api/axios'; // ✅ 추가: AI 호출은 fdClient 사용

const ContainerMonitoringPage = () => {
  const [occupancyRate, setOccupancyRate] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingOcc, setLoadingOcc] = useState(true);
  const [loadingPred, setLoadingPred] = useState(true);

  // 현재 점유율
  useEffect(() => {
    let cancelled = false;
    fdClient.get('/container-monitoring/occupancy')
      .then(({ data }) => {
        if (cancelled) return;
        const percentage = Number(data.occupancy_rate) * 100;
        setOccupancyRate(percentage);
      })
      .catch((err) => {
        console.error('현재 점유율 불러오기 실패', err);
      })
      .finally(() => {
        if (!cancelled) setLoadingOcc(false);
      });
    return () => { cancelled = true; };
  }, []);

  // 예측 데이터
  useEffect(() => {
    let cancelled = false;
    fdClient.get('/container-monitoring/predict-from-file')
      .then(({ data }) => {
        if (cancelled) return;
        const rawPredictions = Object.values(data?.predictions ?? {});
        setPrediction(rawPredictions);
      })
      .catch((err) => {
        console.error('예측값 불러오기 실패', err);
      })
      .finally(() => {
        if (!cancelled) setLoadingPred(false);
      });
    return () => { cancelled = true; };
  }, []);

  const getStatus = (rate) => {
    if (rate >= 90) return { text: '매우 혼잡', color: '#e74c3c' };
    if (rate >= 50) return { text: '혼잡', color: '#f39c12' };
    return { text: '원활', color: '#2ecc71' };
  };

  if (occupancyRate === null || loadingOcc) {
    return <p>📡 점유율 정보를 불러오는 중...</p>;
  }

  const status = getStatus(occupancyRate);

  return (
    <div className="container">
      <h2 className="title">📦 컨테이너 모니터링</h2>

      <div className="card">
        <h3>⏱ 현재 점유율</h3>
        <p className="rate">{occupancyRate.toFixed(2)}%</p>
        <p className="status" style={{ color: status.color }}>
          상태: {status.text}
        </p>
      </div>

      <div className="chatbox">
        <p>
          현재 점유율은 <strong>{occupancyRate.toFixed(2)}%</strong>이며, 상태는{' '}
          <strong>{status.text}</strong>입니다.
        </p>
        {occupancyRate > 90 && <p>⚠️ 상하역 작업이 지연될 가능성이 있습니다.</p>}
        {occupancyRate <= 90 && occupancyRate > 50 && <p>⛓ 혼잡도가 높아 예의주시가 필요합니다.</p>}
        {occupancyRate <= 50 && <p>✅ 현재는 원활한 상태입니다.</p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/affiliation-containers" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            소속 기반 컨테이너 조회하기
          </button>
        </Link>
      </div>

      {!loadingPred && prediction && (
        <>
          <PredictedOccupancyChart predictions={prediction} />
          <PredictedOccupancySummary predictions={prediction} />
        </>
      )}
    </div>
  );
};

export default ContainerMonitoringPage;
