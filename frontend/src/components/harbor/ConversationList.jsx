import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import useHarborStore from '../../store/harborStore';

const ConversationList = () => {
  const {
    conversations,
    currentConversation,
    selectConversation,
    deleteConversation,
    startNewConversation,
    isLoading
  } = useHarborStore();

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko
      });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* 새 대화 버튼 */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={startNewConversation}
        sx={{ mb: 2 }}
        fullWidth
      >
        새 대화 시작
      </Button>

      <Divider sx={{ mb: 1 }} />

      {/* 대화 목록 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {conversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
            <ChatIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">
              아직 대화가 없습니다.
            </Typography>
          </Box>
        ) : (
          <List dense>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                button
                selected={currentConversation === conversation.id}
                onClick={() => selectConversation(conversation.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText
                  primary={conversation.title || '제목 없음'}
                  secondary={formatDate(conversation.createdAt)}
                  primaryTypographyProps={{
                    noWrap: true,
                    variant: 'body2'
                  }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    variant: 'caption',
                    color: currentConversation === conversation.id ? 'inherit' : 'text.secondary'
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    sx={{
                      color: currentConversation === conversation.id ? 'inherit' : 'text.secondary'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ConversationList;
