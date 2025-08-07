import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictedOccupancyChart = ({ historyLength }) => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/occupancy")
      .then((res) => res.json())
      .then((data) => {
        const occupancyRate = data.occupancy_rate;
        // 더미 과거 시계열 데이터 생성
        const fakeHistory = new Array(historyLength).fill(occupancyRate);
        return fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ load_history: fakeHistory }),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data.predictions).map(([timestamp, value]) => ({
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          점유율예측: (value * 100).toFixed(2),
        }));
        setPredictions(formatted);
      })
      .catch((err) => {
        console.error("예측값 불러오기 실패", err);
      });
  }, [historyLength]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>📈 향후 6시간 예측 점유율</h3>
      <ResponsiveContainer>
        <LineChart data={predictions}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line type="monotone" dataKey="점유율예측" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictedOccupancyChart;