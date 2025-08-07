import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Divider,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import useHarborStore from '../../store/harborStore';

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 320,
  height: '100%',
  borderRadius: 0,
  borderRight: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white'
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #f0f0f0'
}));

const ConversationItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: 0,
  margin: 0,
  padding: theme.spacing(1.5, 2),
  borderBottom: '1px solid #f5f5f5',
  backgroundColor: selected ? '#e3f2fd' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? '#e3f2fd' : '#f9f9f9'
  },
  cursor: 'pointer'
}));

const ConversationSidebar = () => {
  const {
    conversations,
    currentConversation,
    selectConversation,
    deleteConversation,
    startNewConversation
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

  return (
    <SidebarContainer elevation={0}>
      <SidebarHeader>
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 500, mb: 2 }}>
          이전 대화 목록
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={startNewConversation}
          fullWidth
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            borderColor: '#e0e0e0',
            color: '#666'
          }}
        >
          새 대화 시작
        </Button>
      </SidebarHeader>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              selected={currentConversation === conversation.id}
              onClick={() => selectConversation(conversation.id)}
            >
              <ListItemText
                primary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: currentConversation === conversation.id ? 600 : 400,
                      color: '#333',
                      fontSize: '0.9rem'
                    }}
                    noWrap
                  >
                    {conversation.title || `대화 ${conversation.id}`}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#999',
                      fontSize: '0.75rem'
                    }}
                  >
                    {formatDate(conversation.createdAt)}
                  </Typography>
                }
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
                    color: '#ccc',
                    '&:hover': {
                      color: '#f44336',
                      backgroundColor: '#ffebee'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ConversationItem>
          ))}
        </List>
      </Box>
    </SidebarContainer>
  );
};

export default ConversationSidebar;
