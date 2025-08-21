// frontend/src/pages/ContainerMonitoringPage.jsx
import React, { useEffect, useState } from 'react';
import PredictedOccupancyChart from './PredictedOccupancyChart';
import PredictedOccupancySummary from './PredictedOccupancySummary';
import { Link } from 'react-router-dom';
import { fdClient } from '../api/axios';
import { CircularProgress } from '@mui/material';

const ContainerMonitoringPage = () => {
  const [occupancyRate, setOccupancyRate] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingOcc, setLoadingOcc] = useState(true);
  const [loadingPred, setLoadingPred] = useState(true);
  const [errorOcc, setErrorOcc] = useState(null);
  const [errorPred, setErrorPred] = useState(null);

  // 현재 점유율
  useEffect(() => {
    let cancelled = false;
    setLoadingOcc(true);
    setErrorOcc(null);

    fdClient
      .get('/container-monitoring/occupancy')
      .then(({ data }) => {
        if (cancelled) return;
        const percentage = Number(data?.occupancy_rate) * 100;
        setOccupancyRate(percentage);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('현재 점유율 불러오기 실패', err);
        setErrorOcc('현재 점유율 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoadingOcc(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 예측 데이터
  useEffect(() => {
    let cancelled = false;
    setLoadingPred(true);
    setErrorPred(null);

    fdClient
      .get('/container-monitoring/predict-from-file')
      .then(({ data }) => {
        if (cancelled) return;
        const rawPredictions = Object.values(data?.predictions ?? {});
        setPrediction(rawPredictions);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('예측값 불러오기 실패', err);
        setErrorPred('예측 데이터를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoadingPred(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getStatus = (rate) => {
    if (rate >= 90) return { text: '매우 혼잡', color: '#e74c3c' };
    if (rate >= 50) return { text: '혼잡', color: '#f39c12' };
    return { text: '원활', color: '#2ecc71' };
  };

  const LoadingBlock = ({ label }) => (
    <div
      style={{
        marginTop: 20,
        padding: 24,
        borderRadius: 8,
        border: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <CircularProgress />
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );

  return (
    <div className="container">
      <h2 className="title">📦 컨테이너 모니터링</h2>

      {/* 현재 점유율 카드 */}
      <div className="card" style={{ minHeight: 140 }}>
        <h3>⏱ 현재 점유율</h3>

        {loadingOcc && <LoadingBlock label="📡 점유율 정보를 불러오는 중..." />}

        {!loadingOcc && errorOcc && (
          <p style={{ color: '#e74c3c', marginTop: 8 }}>{errorOcc}</p>
        )}

        {!loadingOcc && !errorOcc && occupancyRate !== null && (
          <>
            <p className="rate">{occupancyRate.toFixed(2)}%</p>
            <p className="status" style={{ color: getStatus(occupancyRate).color }}>
              상태: {getStatus(occupancyRate).text}
            </p>
          </>
        )}
      </div>

      {/* 상황 설명 박스 */}
      {!loadingOcc && !errorOcc && occupancyRate !== null && (
        <div className="chatbox">
          <p>
            현재 점유율은 <strong>{occupancyRate.toFixed(2)}%</strong>이며, 상태는{' '}
            <strong>{getStatus(occupancyRate).text}</strong>입니다.
          </p>
          {occupancyRate > 90 && <p>⚠️ 상하역 작업이 지연될 가능성이 있습니다.</p>}
          {occupancyRate <= 90 && occupancyRate > 50 && (
            <p>⛓ 혼잡도가 높아 예의주시가 필요합니다.</p>
          )}
          {occupancyRate <= 50 && <p>✅ 현재는 원활한 상태입니다.</p>}
        </div>
      )}

      {/* 소속 기반 컨테이너 링크 */}
      <div style={{ marginTop: '20px' }}>
        <Link to="/affiliation-containers" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            소속 기반 컨테이너 조회하기
          </button>
        </Link>
      </div>

      {/* 예측 데이터 영역 */}
      <div style={{ marginTop: 20 }}>
        {loadingPred && <LoadingBlock label="📊 예측 데이터를 불러오는 중..." />}

        {!loadingPred && errorPred && (
          <p style={{ color: '#e74c3c' }}>{errorPred}</p>
        )}

        {!loadingPred && !errorPred && prediction && prediction.length > 0 && (
          <>
            <PredictedOccupancyChart predictions={prediction} />
            <PredictedOccupancySummary predictions={prediction} />
          </>
        )}

        {!loadingPred && !errorPred && (!prediction || prediction.length === 0) && (
          <p>예측 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ContainerMonitoringPage;
