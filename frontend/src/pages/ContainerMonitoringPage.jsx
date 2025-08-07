import React, { useEffect, useState } from 'react';
import PredictedOccupancyChart from './PredictedOccupancyChart';
import PredictedOccupancySummary from './PredictedOccupancySummary';
import { Link } from 'react-router-dom';


const ContainerMonitoringPage = () => {
  const [occupancyRate, setOccupancyRate] = useState(null);
  const [prediction, setPrediction] = useState(null); // 🔹 예측 데이터 상태 추가

  useEffect(() => {
    fetch("http://localhost:8000/api/occupancy")
      .then((res) => res.json())
      .then((data) => {
        const percentage = data.occupancy_rate * 100;
        setOccupancyRate(percentage);
      })
      .catch((err) => {
        console.error("현재 점유율 불러오기 실패", err);
      });
  }, []);

  const getStatus = (rate) => {
    if (rate >= 90) return { text: '매우 혼잡', color: '#e74c3c' };
    if (rate >= 50) return { text: '혼잡', color: '#f39c12' };
    return { text: '원활', color: '#2ecc71' };
  };

  if (occupancyRate === null) {
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

      <PredictedOccupancyChart historyLength={48} />
      {prediction && <PredictedOccupancySummary predictions={prediction} />}
      
    </div>
    
  );
};

export default ContainerMonitoringPage;


// import React, { useEffect, useState } from 'react';
// import PredictedOccupancyChart from './PredictedOccupancyChart';

// const ContainerMonitoringPage = () => {
//   const [occupancyRate, setOccupancyRate] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/occupancy")  // ← 서버 주소에 맞게 조정
//       .then((res) => res.json())
//       .then((data) => {
//         const percentage = data.occupancy_rate * 100;
//         setOccupancyRate(percentage);
//       })
//       .catch((err) => {
//         console.error("현재 점유율 불러오기 실패", err);
//       });
//   }, []);

//   const getStatus = (rate) => {
//     if (rate >= 90) return { text: '매우 혼잡', color: '#e74c3c' };
//     if (rate >= 50) return { text: '혼잡', color: '#f39c12' };
//     return { text: '원활', color: '#2ecc71' };
//   };

//   if (occupancyRate === null) {
//     return <p>📡 점유율 정보를 불러오는 중...</p>;
//   }

//   const status = getStatus(occupancyRate);

//   return (
//     <div className="container">
//       <h2 className="title">📦 컨테이너 모니터링</h2>

//       <div className="card">
//         <h3>⏱ 현재 점유율</h3>
//         <p className="rate">{occupancyRate.toFixed(2)}%</p>
//         <p className="status" style={{ color: status.color }}>
//           상태: {status.text}
//         </p>
//       </div>

//       <div className="chatbox">
//         <p>
//           현재 점유율은 <strong>{occupancyRate.toFixed(2)}%</strong>이며, 상태는{' '}
//           <strong>{status.text}</strong>입니다.
//         </p>
//         {occupancyRate > 90 && <p>⚠️ 상하역 작업이 지연될 가능성이 있습니다.</p>}
//         {occupancyRate <= 90 && occupancyRate > 50 && <p>⛓ 혼잡도가 높아 예의주시가 필요합니다.</p>}
//         {occupancyRate <= 50 && <p>✅ 현재는 원활한 상태입니다.</p>}
//       </div>

//       <PredictedOccupancyChart />
//     </div>
//   );
// };

// export default ContainerMonitoringPage;

// <PredictedOccupancyChart historyLength={48} />