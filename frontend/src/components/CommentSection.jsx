import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { showNotification } = useNotificationStore();

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await apiClient.post(`/posts/${postId}/comments`, { content: newComment });
      setNewComment('');
      showNotification('댓글이 성공적으로 작성되었습니다.', 'success');
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      showNotification('댓글 작성에 실패했습니다.', 'error');
    }
  };
  
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>댓글</Typography>
      <Box component="form" sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleCommentSubmit}>등록</Button>
      </Box>
      <List>
        {comments.map((comment, index) => (
          <Box key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={comment.authorName}
                secondary={comment.content}
              />
              {/* 본인 댓글에만 수정/삭제 버튼 표시 */}
              {user?.id === comment.authorId && (
                <Box>
                  <Button size="small">수정</Button>
                  <Button size="small" color="error">삭제</Button>
                </Box>
              )}
            </ListItem>
            {index < comments.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
}

export default CommentSection;