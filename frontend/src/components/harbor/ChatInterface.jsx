import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useHarborStore from '../../store/harborStore';
import MessageBubble from './MessageBubble';

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: 'white'
}));

const MessagesArea = styled(Box)(({ theme, isMobile }) => ({
  flex: 1,
  overflow: 'auto',
  padding: isMobile ? theme.spacing(2) : theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: isMobile ? theme.spacing(2) : theme.spacing(3),
  backgroundColor: '#fafbfc'
}));

const InputArea = styled(Box)(({ theme, isMobile }) => ({
  padding: isMobile ? theme.spacing(1.5, 2) : theme.spacing(2, 3),
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0'
}));

const InputContainer = styled(Box)(({ theme, isMobile }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  borderRadius: isMobile ? theme.spacing(2) : theme.spacing(3),
  padding: isMobile ? theme.spacing(0.5, 1.5) : theme.spacing(0.5, 2),
  border: '1px solid #e0e0e0'
}));

const WelcomeMessage = styled(Paper)(({ theme, isMobile }) => ({
  padding: isMobile ? theme.spacing(2) : theme.spacing(3),
  textAlign: 'center',
  backgroundColor: 'white',
  border: '1px solid #e8eaed',
  borderRadius: theme.spacing(2),
  maxWidth: isMobile ? '100%' : 600,
  margin: '0 auto',
  marginTop: isMobile ? theme.spacing(2) : theme.spacing(4)
}));

const ChatInterface = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    messages,
    processQuery,
    currentConversation,
    isProcessing
  } = useHarborStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const query = inputValue.trim();
    setInputValue('');

    try {
      await processQuery(query, currentConversation);
    } catch (error) {
      console.error('Failed to process query:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ChatContainer>
      <MessagesArea isMobile={isMobile}>
        {messages.length === 0 && !isProcessing ? (
          <WelcomeMessage elevation={0} isMobile={isMobile}>
            <Avatar
              sx={{ 
                width: isMobile ? 50 : 60, 
                height: isMobile ? 50 : 60, 
                margin: '0 auto 16px',
                backgroundColor: '#1976d2'
              }}
            >
              🛥️
            </Avatar>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ fontWeight: 600, color: '#333', mb: 1 }}
            >
              Harbor AI Assistant
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{ color: '#666', mb: 2 }}
            >
              항만 및 해운 관련 규정에 특화된 AI 어시스턴트
            </Typography>
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              sx={{ color: '#999' }}
            >
              궁금한 항만 법규나 절차에 대해 질문해주세요.
            </Typography>
          </WelcomeMessage>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isProcessing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  답변을 생성 중입니다...
                </Typography>
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea isMobile={isMobile}>
        <InputContainer component="form" onSubmit={handleSubmit} isMobile={isMobile}>
          <TextField
            fullWidth
            multiline
            maxRows={isMobile ? 3 : 4}
            placeholder={isMobile ? "질문하세요..." : "항만 법규나 절차에 대해 질문하세요..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: isMobile ? '0.9rem' : '0.95rem' }
            }}
            sx={{ 
              '& .MuiInputBase-root': {
                padding: 0
              }
            }}
          />
          <IconButton
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: inputValue.trim() && !isProcessing ? '#1976d2' : '#ccc'
            }}
          >
            <SendIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </InputContainer>
        
        <Typography variant="caption" sx={{ 
          color: '#999', 
          textAlign: 'center', 
          display: 'block', 
          mt: 1,
          fontSize: isMobile ? '0.7rem' : '0.75rem'
        }}>
          실시간 응답 제공
        </Typography>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatInterface;
