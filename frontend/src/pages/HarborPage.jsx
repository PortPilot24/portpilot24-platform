import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ConversationList from '../components/harbor/ConversationList';
import ChatInterface from '../components/harbor/ChatInterface';
import StatusIndicator from '../components/harbor/StatusIndicator';
import useHarborStore from '../store/harborStore';
import useAuthStore from '../store/authStore';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '80vh',
  display: 'flex',
  flexDirection: 'column'
}));

const HarborPage = () => {
  const { user } = useAuthStore();
  const {
    loadConversations,
    checkHealth,
    checkConnection,
    healthStatus,
    connectionStatus,
    isLoading
  } = useHarborStore();

  useEffect(() => {
    // 페이지 로드 시 초기 데이터 로드
    loadConversations();
    checkHealth();
    checkConnection();

    // 주기적으로 연결 상태 체크 (30초마다)
    const interval = setInterval(() => {
      checkConnection();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadConversations, checkHealth, checkConnection]);

  if (isLoading && !healthStatus) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Harbor AI Assistant
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            안녕하세요, {user?.name || user?.email}님
          </Typography>
          <StatusIndicator 
            healthStatus={healthStatus} 
            connectionStatus={connectionStatus}
          />
        </Box>
      </Box>

      {/* 메인 컨텐츠 */}
      <Grid container spacing={3}>
        {/* 대화 목록 */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              대화 목록
            </Typography>
            <ConversationList />
          </StyledPaper>
        </Grid>

        {/* 채팅 인터페이스 */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <ChatInterface />
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HarborPage;
