import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axios';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';

function BoardListPage() {
  const [posts, setPosts] = useState([]); // 초기 상태를 빈 배열로 돌려놓습니다.
  const [loading, setLoading] = useState(true); // 로딩 상태를 다시 true로 시작합니다.
  const navigate = useNavigate();

  // API 호출 로직을 다시 활성화합니다.
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 로딩 중일 때 로딩 스피너를 보여줍니다.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          게시판
        </Typography>
        <Button variant="contained" onClick={() => navigate('/posts/new')}>
          글 작성
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell align="center" width="10%">No.</TableCell>
              <TableCell align="left" width="50%">글 제목</TableCell>
              <TableCell align="center" width="15%">작성자</TableCell>
              <TableCell align="center" width="15%">작성일</TableCell>
              <TableCell align="center" width="10%">첨부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                hover
                onClick={() => navigate(`/posts/${post.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align="center">
                  {post.isNotice ? <Chip label="공지" color="primary" size="small"/> : post.no}
                </TableCell>
                <TableCell align="left">{post.title}</TableCell>
                <TableCell align="center">{post.author}</TableCell>
                <TableCell align="center">{post.createdAt}</TableCell>
                <TableCell align="center">
                  {post.hasAttachment && <AttachmentIcon fontSize="small" color="action" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default BoardListPage;