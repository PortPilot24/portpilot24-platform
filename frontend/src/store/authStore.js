import { create } from 'zustand';
import apiClient from '../api/axios';

const useAuthStore = create((set, get) => ({
  isLoggedIn: !!localStorage.getItem('jwt_token'),
  user: null, // 사용자 정보를 저장할 상태 추가
  
  // 로그인 시 토큰 저장 후 사용자 정보를 가져오는 로직 추가
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const token = response.data.token;
      
      localStorage.setItem('jwt_token', token);
      set({ isLoggedIn: true });
      
      // 로그인 성공 후 바로 사용자 정보 가져오기
      await get().fetchUser();

      return Promise.resolve(response.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ isLoggedIn: false, user: null }); // 로그아웃 시 사용자 정보도 초기화
  },
  
  // 사용자 정보를 가져와 스토어에 저장하는 함수
  fetchUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      set({ user: response.data });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // 토큰이 유효하지 않으면 로그아웃 처리
      get().logout();
    }
  }
}));

// 앱 시작 시 토큰이 있으면 사용자 정보 미리 가져오기
const token = localStorage.getItem('jwt_token');
if (token) {
  useAuthStore.getState().fetchUser();
}


export default useAuthStore;