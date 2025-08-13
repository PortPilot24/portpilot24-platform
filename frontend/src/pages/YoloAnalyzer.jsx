// frontend/src/pages/YoloAnalyzer.jsx
import React, { useEffect, useState } from "react";
import { fdClient } from "../api/axios"; // ✅ AI 호출은 fdClient 사용

function YoloAnalyzer() {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [unprotectedCount, setUnprotectedCount] = useState(null);
  const [streamUrl, setStreamUrl] = useState("/safety-detector/stream"); // ✅ 스트림 URL 상태

  const handleUpload = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("file", videoFile);

    setLoading(true);
    setStreamReady(false);

    try {
      // axios + FormData: Content-Type은 자동으로 설정됨(수동 설정 X 권장)
      await fdClient.post("/safety-detector/upload", formData);

      // 스트리밍 준비
      setStreamReady(true);

      // 🔐 스트림이 보호 엔드포인트라면 토큰을 쿼리로 붙여 사용 (백엔드에서 허용 필요)
      const token = localStorage.getItem("access_token");
      if (token) {
        setStreamUrl(`/safety-detector/stream?access_token=${encodeURIComponent(token)}`);
      } else {
        setStreamUrl(`/safety-detector/stream`);
      }
    } catch (e) {
      console.error("업로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  // 상태 폴링
  useEffect(() => {
    if (!streamReady) return;
    let cancelled = false;
    const intervalId = setInterval(async () => {
      try {
        const { data } = await fdClient.get("/safety-detector/status");
        if (!cancelled) setUnprotectedCount(data.unprotected_person);
      } catch (err) {
        console.error("상태 업데이트 실패:", err);
      }
    }, 3000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [streamReady]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🛡️ YOLOv8 안전보호구 미착용 감지 시스템
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-200"
            disabled={!videoFile || loading}
          >
            {loading ? "업로드 중..." : "분석 시작"}
          </button>
        </div>

        {loading && (
          <div className="text-blue-600 font-semibold animate-pulse mb-4">
            분석 중입니다...
          </div>
        )}

        {streamReady && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              📷 분석 영상 스트리밍
            </h3>
            <img
              src={streamUrl} // ✅ 절대경로 + (필요시) 토큰 쿼리
              alt="YOLO Stream"
              className="w-full max-w-3xl mx-auto border border-gray-300 rounded"
            />

            <div className="mt-6 flex justify-center">
              <div className="bg-white shadow-md rounded p-4 text-center">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  📝 보호구 미착용자 수
                </h4>
                {unprotectedCount === null ? (
                  <p className="text-gray-500">감지 중입니다...</p>
                ) : (
                  <p className="text-3xl font-bold text-red-600">
                    {unprotectedCount}명
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default YoloAnalyzer;
