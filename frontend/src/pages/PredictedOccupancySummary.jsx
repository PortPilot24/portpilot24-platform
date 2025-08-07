import React, { useEffect, useState } from 'react';

const PredictedOccupancySummary = ({ predictions }) => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!predictions) return;

    const values = Object.values(predictions).map(v => v * 100);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    let status = '';
    if (avg >= 90) status = '매우 혼잡할 것으로 예상됩니다.';
    else if (avg >= 50) status = '혼잡할 가능성이 있습니다.';
    else status = '원활할 것으로 보입니다.';

    setSummary(`향후 3시간 동안 평균 예상 점유율은 ${avg.toFixed(2)}%이며, ${status}`);
  }, [predictions]);

  return (
    <div className="llm-summary-box">
      <h3>🧠 AI 예측 요약</h3>
      <p>{summary}</p>
    </div>
  );
};

export default PredictedOccupancySummary;
