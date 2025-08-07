import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ConversationSidebar from '../components/harbor/ConversationSidebar';
import ChatInterface from '../components/harbor/ChatInterface';
import StatusIndicator from '../components/harbor/StatusIndicator';
import useHarborStore from '../store/harborStore';
import useAuthStore from '../store/authStore';

const MainContainer = styled(Container)(({ theme }) => ({
  padding: 0,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 'none !important'
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  backgroundColor: '#f5f7fa'
}));

const HarborPage = () => {
  const { user } = useAuthStore();
  const {
    loadConversations,
    checkHealth,
    checkConnection,
    healthStatus,
    connectionStatus
  } = useHarborStore();

  useEffect(() => {
    loadConversations();
    checkHealth();
    checkConnection();

    const interval = setInterval(() => {
      checkConnection();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadConversations, checkHealth, checkConnection]);

  return (
    <MainContainer>
      {/* 상단 앱바 */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1976d2', fontWeight: 600 }}>
            Harbor AI Assistant
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.name || user?.email}님
            </Typography>
            <StatusIndicator 
              healthStatus={healthStatus} 
              connectionStatus={connectionStatus}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <ContentArea>
        {/* 사이드바 */}
        <ConversationSidebar />
        
        {/* 채팅 영역 */}
        <ChatInterface />
      </ContentArea>
    </MainContainer>
  );
};

export default HarborPage;
