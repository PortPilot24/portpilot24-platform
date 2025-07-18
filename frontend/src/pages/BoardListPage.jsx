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
  Pagination, // Pagination 컴포넌트 import
} from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';

function BoardListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // API 호출 시 페이지 번호를 파라미터로 전달
        const response = await apiClient.get('/posts', {
          params: { page: page - 1, size: 10 } // 서버는 보통 0페이지부터 시작하므로 -1
        });
        setPosts(response.data.content); // 실제 게시글 목록
        setTotalPages(response.data.totalPages); // 전체 페이지 수
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]); // page가 바뀔 때마다 API를 다시 호출

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
            {/* ... TableHead 내용은 이전과 동일 ... */}
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                hover
                onClick={() => navigate(`/posts/${post.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                {/* ... TableCell 내용들은 이전과 동일 ... */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 컴포넌트 추가 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default BoardListPage;