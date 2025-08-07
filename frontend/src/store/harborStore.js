import { create } from 'zustand';
import { harborApi } from '../api/harborApi';
import useNotificationStore from './notificationStore';

const useHarborStore = create((set, get) => ({
  // 상태
  conversations: [],
  currentConversation: null,
  messages: [],
  currentQuery: '',
  isLoading: false,
  isProcessing: false,
  healthStatus: null,
  connectionStatus: false,

  // 액션
  setCurrentQuery: (query) => set({ currentQuery: query }),

  // 대화 목록 로드
  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await harborApi.getConversations();
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Failed to load conversations:', error);
      useNotificationStore.getState().showNotification(
        '대화 목록을 불러오는데 실패했습니다.',
        'error'
      );
      set({ isLoading: false });
    }
  },

  // 특정 대화 선택 및 메시지 로드
  selectConversation: async (conversationId) => {
    set({ isLoading: true, currentConversation: conversationId });
    try {
      const messages = await harborApi.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch (error) {
      console.error('Failed to load messages:', error);
      useNotificationStore.getState().showNotification(
        '메시지를 불러오는데 실패했습니다.',
        'error'
      );
      set({ isLoading: false, messages: [] });
    }
  },

  // 새 질의 처리
  processQuery: async (query, messageListId = null) => {
    set({ isProcessing: true });
    try {
      const queryData = {
        query,
        messageListId
      };
      
      const response = await harborApi.processQuery(queryData);
      
      // 현재 메시지에 추가
      const currentMessages = get().messages;
      const newMessage = {
        id: response.messageId,
        query: response.query,
        answer: response.answer,
        toolCalls: response.tool_calls || [],
        createdAt: new Date().toISOString()
      };
      
      set({ 
        messages: [...currentMessages, newMessage],
        currentQuery: '',
        isProcessing: false,
        currentConversation: response.messageListId
      });

      // 대화 목록 새로고침
      get().loadConversations();
      
      useNotificationStore.getState().showNotification(
        '질의가 성공적으로 처리되었습니다.',
        'success'
      );

      return response;
    } catch (error) {
      console.error('Failed to process query:', error);
      useNotificationStore.getState().showNotification(
        '질의 처리에 실패했습니다.',
        'error'
      );
      set({ isProcessing: false });
      throw error;
    }
  },

  // 대화 삭제
  deleteConversation: async (listId) => {
    try {
      await harborApi.deleteConversation(listId);
      
      // 로컬 상태에서 제거
      const conversations = get().conversations.filter(conv => conv.id !== listId);
      set({ conversations });
      
      // 현재 선택된 대화가 삭제된 경우 초기화
      if (get().currentConversation === listId) {
        set({ currentConversation: null, messages: [] });
      }
      
      useNotificationStore.getState().showNotification(
        '대화가 삭제되었습니다.',
        'success'
      );
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      useNotificationStore.getState().showNotification(
        '대화 삭제에 실패했습니다.',
        'error'
      );
    }
  },

  // 메시지 삭제
  deleteMessage: async (messageId) => {
    try {
      await harborApi.deleteMessage(messageId);
      
      // 로컬 상태에서 제거
      const messages = get().messages.filter(msg => msg.id !== messageId);
      set({ messages });
      
      useNotificationStore.getState().showNotification(
        '메시지가 삭제되었습니다.',
        'success'
      );
    } catch (error) {
      console.error('Failed to delete message:', error);
      useNotificationStore.getState().showNotification(
        '메시지 삭제에 실패했습니다.',
        'error'
      );
    }
  },

  // 헬스 체크
  checkHealth: async () => {
    try {
      const health = await harborApi.checkHealth();
      set({ healthStatus: health });
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      set({ healthStatus: null });
      return null;
    }
  },

  // 연결 상태 체크
  checkConnection: async () => {
    try {
      const status = await harborApi.checkConnection();
      set({ connectionStatus: status.connected });
      return status.connected;
    } catch (error) {
      console.error('Connection check failed:', error);
      set({ connectionStatus: false });
      return false;
    }
  },

  // 새 대화 시작
  startNewConversation: () => {
    set({
      currentConversation: null,
      messages: [],
      currentQuery: ''
    });
  }
}));

export default useHarborStore;
