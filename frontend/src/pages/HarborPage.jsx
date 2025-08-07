import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
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

const ContentArea = styled(Box)(({ theme, isMobile }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  overflow: 'hidden',
  backgroundColor: '#f5f7fa'
}));

const HarborPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <MainContainer>
      {/* 상단 앱바 */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          {/* 모바일에서 햄버거 메뉴 표시[11][14] */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2, color: '#1976d2' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#1976d2', 
              fontWeight: 600,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
          >
            Harbor AI Assistant
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary">
                {user?.name || user?.email}님
              </Typography>
            )}
            <StatusIndicator 
              healthStatus={healthStatus} 
              connectionStatus={connectionStatus}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <ContentArea isMobile={isMobile}>
        {/* 데스크톱: 일반 사이드바, 모바일: Drawer */}
        {isMobile ? (
          <>
            {/* 모바일 드로어 */}
            <Drawer
              anchor="left"
              open={mobileMenuOpen}
              onClose={handleMobileMenuToggle}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '80%',
                  maxWidth: 320
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleMobileMenuToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <ConversationSidebar />
            </Drawer>
            
            {/* 모바일에서는 채팅 인터페이스가 전체 영역 차지 */}
            <ChatInterface />
          </>
        ) : (
          <>
            {/* 데스크톱 사이드바 */}
            <ConversationSidebar />
            {/* 채팅 영역 */}
            <ChatInterface />
          </>
        )}
      </ContentArea>
    </MainContainer>
  );
};

export default HarborPage;
