// components/PredictedOccupancySummary.jsx

import { useEffect, useState } from "react";
import { fdClient } from '../api/axios';

function PredictedOccupancySummary({ predictions }) {
  const [summary, setSummary] = useState("요약을 불러오는 중...");

  useEffect(() => {
    if (predictions.length > 0) {
      fdClient.post('/container-monitoring/summary',{ predictions } )
        .then((res) => setSummary(res.data.summary))
        .catch(() => setSummary("요약 불러오기 실패"));
    }
  }, [predictions]);

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">📋 LLM 요약</h3>
      <p>{summary}</p>
    </div>
  );
}

export default PredictedOccupancySummary;