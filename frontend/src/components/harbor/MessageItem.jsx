import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Build as ToolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import useHarborStore from '../../store/harborStore';

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

const MessageItem = ({ message }) => {
  const { deleteMessage } = useHarborStore();

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
    <Stack spacing={2}>
      {/* 사용자 질문 */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <PersonIcon sx={{ mt: 1, color: 'primary.main' }} />
        <MessageBubble isUser={true} elevation={1}>
          <Typography variant="body1">
            {message.query}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
            {formatDate(message.createdAt)}
          </Typography>
        </MessageBubble>
        <IconButton
          size="small"
          onClick={() => deleteMessage(message.id)}
          sx={{ mt: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* AI 응답 */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <BotIcon sx={{ mt: 1, color: 'secondary.main' }} />
        <Box sx={{ flex: 1 }}>
          <MessageBubble isUser={false} elevation={1}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.answer}
            </Typography>
          </MessageBubble>

          {/* 도구 호출 정보 */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ToolIcon fontSize="small" />
                    <Typography variant="body2">
                      도구 호출 ({message.toolCalls.length}개)
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {message.toolCalls.map((toolCall, index) => (
                      <Paper key={index} sx={{ p: 1, backgroundColor: 'grey.50' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {toolCall.tool}
                        </Typography>
                        {toolCall.sourceFile && (
                          <Typography variant="caption" color="text.secondary">
                            파일: {toolCall.sourceFile}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default MessageItem;
