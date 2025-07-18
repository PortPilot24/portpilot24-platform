import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import CommentSection from '../components/CommentSection';
import ConfirmationDialog from '../components/ConfirmationDialog'; // 확인창 import
import { Container, Typography, Box, CircularProgress, Paper, Button, Link } from '@mui/material';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false); // 다이얼로그 상태
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showNotification } = useNotificationStore();

  useEffect(() => { /* ... 이전과 동일 ... */ }, [id]);

  const handleDelete = async () => {
    setDialogOpen(false);
    try {
      await apiClient.delete(`/posts/${id}`);
      showNotification('게시글이 삭제되었습니다.', 'success');
      navigate('/posts');
    } catch (error) {
      showNotification('게시글 삭제에 실패했습니다.', 'error');
    }
  };

  if (loading) { /* ... 이전과 동일 ... */ }
  if (!post) { /* ... 이전과 동일 ... */ }
  
  const isAuthor = user?.id === post.authorId;

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          {/* ... 게시글 내용 부분은 이전과 동일 ... */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate('/posts')}>목록으로</Button>
            {isAuthor && (
              <>
                <Button variant="contained" color="primary" onClick={() => navigate(`/posts/${id}/edit`)}>수정</Button>
                <Button variant="contained" color="error" onClick={() => setDialogOpen(true)}>삭제</Button>
              </>
            )}
          </Box>
        </Paper>
        <CommentSection postId={id} />
      </Container>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        title="게시글 삭제"
        message="정말 이 게시글을 삭제하시겠습니까? 되돌릴 수 없습니다."
      />
    </>
  );
}

export default PostDetailPage;