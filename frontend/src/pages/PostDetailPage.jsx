import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axios';
import useAuthStore from '../store/authStore';
import CommentSection from '../components/CommentSection'; // 댓글 컴포넌트 import
import { Container, Typography, Box, CircularProgress, Paper, Button, Link } from '@mui/material';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore(); // 로그인한 사용자 정보 가져오기

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return <Typography>게시글을 찾을 수 없습니다.</Typography>;
  }
  
  // 현재 로그인한 사용자가 게시글 작성자인지 확인
  const isAuthor = user?.id === post.authorId;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          작성자: {post.authorName}
        </Typography>
        <Box sx={{ my: 4, whiteSpace: 'pre-wrap' }}>
          <Typography variant="body1">{post.content}</Typography>
        </Box>

        {/* ... 첨부파일 표시 부분은 이전과 동일 ... */}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/posts')}>
            목록으로
          </Button>
          {/* 작성자 본인일 경우에만 수정/삭제 버튼 표시 */}
          {isAuthor && (
            <>
              <Button variant="contained" color="primary" onClick={() => navigate(`/posts/${id}/edit`)}>
                수정
              </Button>
              <Button variant="contained" color="error">
                삭제
              </Button>
            </>
          )}
        </Box>
      </Paper>
      
      {/* 댓글 섹션 추가 */}
      <CommentSection postId={id} />
    </Container>
  );
}

export default PostDetailPage;