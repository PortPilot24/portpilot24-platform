import { create } from 'zustand';
import apiClient from '../api/axios'; // API 클라이언트 import

const useAuthStore = create((set) => ({
  isLoggedIn: !!localStorage.getItem('jwt_token'),
  // login 함수가 email, password를 인자로 받도록 수정
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const token = response.data.token;
      
      localStorage.setItem('jwt_token', token);
      set({ isLoggedIn: true });

      return Promise.resolve(response.data); // 성공 시 Promise 이행
    } catch (error) {
      return Promise.reject(error); // 실패 시 Promise 거부
    }
  },
  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ isLoggedIn: false });
  },
}));

export default useAuthStore;