import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useHarborStore from '../../store/harborStore';
import MessageItem from './MessageItem';

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end'
}));

const ChatInterface = () => {
  const {
    messages,
    currentQuery,
    setCurrentQuery,
    processQuery,
    currentConversation,
    isProcessing
  } = useHarborStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // 메시지가 업데이트될 때 스크롤을 맨 아래로
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
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          {currentConversation ? `대화 #${currentConversation}` : '새 대화'}
        </Typography>
      </Box>

      {/* 메시지 영역 */}
      <MessageContainer>
        {messages.length === 0 && !isProcessing ? (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 4, 
            opacity: 0.6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <BotIcon sx={{ fontSize: 64 }} />
            <Typography variant="h6">
              Harbor AI Assistant
            </Typography>
            <Typography variant="body2">
              항만 관련 질문을 입력해주세요.
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            
            {/* 처리 중 표시 */}
            {isProcessing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  처리 중...
                </Typography>
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>

      {/* 입력 영역 */}
      <InputContainer component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="항만 관련 질문을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          variant="outlined"
          size="small"
        />
        <IconButton
          type="submit"
          disabled={!inputValue.trim() || isProcessing}
          color="primary"
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Box>
  );
};

export default ChatInterface;
