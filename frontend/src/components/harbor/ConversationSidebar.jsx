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
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import useHarborStore from '../../store/harborStore';

const SidebarContainer = styled(Paper)(({ theme, isMobile }) => ({
  width: isMobile ? '100%' : 320,
  height: '100%',
  borderRadius: 0,
  borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
  borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  maxHeight: isMobile ? '200px' : '100%'
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
  cursor: 'pointer',
  // 아이콘과 텍스트가 겹치지 않도록 여백 확보
  paddingRight: theme.spacing(6)
}));

// 제목 텍스트용 컨테이너
const TitleContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0, // flexbox에서 텍스트 오버플로우가 작동하도록 필수
  paddingRight: theme.spacing(1)
}));

const ConversationSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    conversations,
    currentConversation,
    selectConversation,
    deleteConversation,
    startNewConversation
  } = useHarborStore();

  const formatDate = (dateString) => {
    try {
      // 실제 시간 계산하여 정확한 상대 시간 표시[2][9]
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ko
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  // 제목 자르기 함수 (최대 길이 제한)
  const truncateTitle = (title, maxLength = isMobile ? 25 : 30) => {
    if (!title) return `대화 ${Math.random().toString(36).substr(2, 5)}`;
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <SidebarContainer elevation={0} isMobile={isMobile}>
      <SidebarHeader>
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          sx={{ color: '#333', fontWeight: 500, mb: 2 }}
        >
          {isMobile ? '대화' : '이전 대화 목록'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={startNewConversation}
          fullWidth
          size={isMobile ? "small" : "medium"}
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

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        maxHeight: isMobile ? '120px' : 'none'
      }}>
        <List sx={{ p: 0 }}>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              selected={currentConversation === conversation.id}
              onClick={() => selectConversation(conversation.id)}
            >
              <TitleContainer>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: currentConversation === conversation.id ? 600 : 400,
                    color: '#333',
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    // CSS를 이용한 텍스트 오버플로우 처리[7][10]
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    width: '100%'
                  }}
                  title={conversation.title || `대화 ${conversation.id}`} // 툴팁으로 전체 제목 표시
                >
                  {truncateTitle(conversation.title)}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#999',
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatDate(conversation.createdAt)}
                </Typography>
              </TitleContainer>
              
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
                    },
                    // 절대 위치로 고정하여 텍스트와 겹침 방지
                    position: 'absolute',
                    right: theme.spacing(1),
                    top: '50%',
                    transform: 'translateY(-50%)'
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
