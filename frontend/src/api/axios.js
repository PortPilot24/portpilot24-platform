import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 API 기본 주소
});

// 요청 인터셉터: 모든 요청 헤더에 JWT 토큰을 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token'); // 로컬 스토리지에서 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;