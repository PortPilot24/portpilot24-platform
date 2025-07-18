import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Container, Typography, Box, CircularProgress, Paper, Button, Link } from '@mui/material';

function PostDetailPage() {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          작성자: {post.author}
        </Typography>
        <Box sx={{ my: 4, whiteSpace: 'pre-wrap' }}>
          <Typography variant="body1">{post.content}</Typography>
        </Box>

        {/* 첨부파일 표시 부분 */}
        {post.attachedFiles && post.attachedFiles.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">첨부파일</Typography>
            {post.attachedFiles.map((file) => (
              <Link href={file.fileUrl} key={file.fileName} target="_blank" rel="noopener noreferrer">
                {file.fileName}
              </Link>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/posts')}>
            목록으로
          </Button>
          {/* 본인 글일 경우 수정/삭제 버튼 보이도록 로직 추가 필요 */}
        </Box>
      </Paper>
      {/* 댓글 컴포넌트가 들어갈 자리 */}
    </Container>
  );
}

export default PostDetailPage;