import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Avatar
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

const MessagesArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  backgroundColor: '#fafbfc'
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0'
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(0.5, 2),
  border: '1px solid #e0e0e0'
}));

const WelcomeMessage = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: 'white',
  border: '1px solid #e8eaed',
  borderRadius: theme.spacing(2),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4)
}));

const ChatInterface = () => {
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
      <MessagesArea>
        {messages.length === 0 && !isProcessing ? (
          <WelcomeMessage elevation={0}>
            <Avatar
              sx={{ 
                width: 60, 
                height: 60, 
                margin: '0 auto 16px',
                backgroundColor: '#1976d2'
              }}
            >
              🛥️
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
              Harbor AI Assistant
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
              항만 및 해운 관련 규정에 특화된 AI 어시스턴트
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
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

      <InputArea>
        <InputContainer component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="항만 법규나 절차에 대해 질문하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '0.95rem' }
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
            sx={{ 
              color: inputValue.trim() && !isProcessing ? '#1976d2' : '#ccc'
            }}
          >
            <SendIcon />
          </IconButton>
        </InputContainer>
        
        <Typography variant="caption" sx={{ 
          color: '#999', 
          textAlign: 'center', 
          display: 'block', 
          mt: 1 
        }}>
          실시간 응답 제공
        </Typography>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatInterface;
