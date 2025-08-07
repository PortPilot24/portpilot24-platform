import apiClient from './axios';

export const harborApi = {
  // 질의 처리
  processQuery: async (queryData) => {
    const response = await apiClient.post('/harbor/query', queryData);
    return response.data;
  },

  // 대화 목록 조회
  getConversations: async () => {
    const response = await apiClient.get('/harbor/conversations');
    return response.data;
  },

  // 특정 대화의 메시지 조회
  getMessages: async (messageId) => {
    const response = await apiClient.get(`/harbor/messages/${messageId}`);
    return response.data;
  },

  // 메시지 삭제
  deleteMessage: async (messageId) => {
    await apiClient.delete(`/harbor/message/${messageId}`);
  },

  // 대화 삭제
  deleteConversation: async (listId) => {
    await apiClient.delete(`/harbor/conversation/${listId}`);
  },

  // 헬스 체크
  checkHealth: async () => {
    const response = await apiClient.get('/harbor/health');
    return response.data;
  },

  // 상태 조회
  getStatus: async () => {
    const response = await apiClient.get('/harbor/status');
    return response.data;
  },

  // 연결 상태 체크
  checkConnection: async () => {
    const response = await apiClient.get('/harbor/connection');
    return response.data;
  }
};
