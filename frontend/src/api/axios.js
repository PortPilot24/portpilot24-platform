import axios from 'axios';
import useAuthStore from '../store/authStore';

// ─────────────────────────────────────────────────────────────
// 공통: 토큰 주입
const withAuth = (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// ─────────────────────────────────────────────────────────────
// 1) 웹 백엔드용 클라이언트: /api 베이스
const apiClient = axios.create({ baseURL: '/api' });
apiClient.interceptors.request.use(withAuth);

// 2) Front Door 절대경로 전용 클라이언트(AI 등): baseURL 없음
const fdClient = axios.create();
fdClient.interceptors.request.use(withAuth);

// 3) 재발급 전용 클라이언트(인터셉터/Authorization 없음) ← 핵심!
const refreshClient = axios.create({ baseURL: '/api' });

// ─────────────────────────────────────────────────────────────
// 리프레시 큐(동시에 여러 401이 와도 재발급 1번만 수행)
let isRefreshing = false;
let refreshWaiters = []; // [(token)=>void]

const notifyWaiters = (newAccessToken) => {
  refreshWaiters.forEach((cb) => cb(newAccessToken));
  refreshWaiters = [];
};

// 실제 재발급 수행
const doRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await refreshClient.post('users/refresh', { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = data;

  localStorage.setItem('access_token', accessToken);
  if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

  return accessToken;
};

// ─────────────────────────────────────────────────────────────
// 공통 401 처리 로직(두 클라이언트에 동일하게 붙인다)
const attach401Handler = (client) => {
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { config, response } = error;
      if (!response) return Promise.reject(error); // 네트워크 에러 등

      // 재발급 엔드포인트 자체는 재시도 금지 (루프 방지)
      const url = (config.url || '').toString();
      if (url.includes('/users/refresh')) {
        return Promise.reject(error);
      }

      if (response.status === 401 && !config._retry) {
        config._retry = true;

        // 이미 재발급 중이면 새 토큰 나올 때까지 대기
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshWaiters.push((newAccessToken) => {
              config.headers = config.headers || {};
              config.headers.Authorization = `Bearer ${newAccessToken}`;
              resolve(client(config));
            });
          });
        }

        // 재발급 시작
        isRefreshing = true;
        try {
          const newAccessToken = await doRefresh();
          isRefreshing = false;
          notifyWaiters(newAccessToken);

          // 현재 요청 재시도
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(config);
        } catch (e) {
          isRefreshing = false;
          notifyWaiters(null); // 대기자들 정리
          // 로그아웃 및 실패 전파
          try { useAuthStore.getState().logout?.(); } catch {}
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
};

attach401Handler(apiClient);
attach401Handler(fdClient);

// ─────────────────────────────────────────────────────────────
export { apiClient, fdClient };
export default apiClient;
