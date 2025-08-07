import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const PredictedOccupancyChart = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return <p>📉 예측 데이터를 불러오는 중...</p>;
  }

  // 예측값(0~1)을 퍼센트와 시간 포맷으로 가공
  const formatted = predictions.map((value, index) => ({
    time: `${index * 30}분 후`,  // 또는 실제 시간 계산해도 됨
    점유율예측: (value * 100).toFixed(2),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>📈 향후 6시간 예측 점유율</h3>
      <ResponsiveContainer>
        <LineChart data={formatted}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} unit="%" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="점유율예측"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictedOccupancyChart;