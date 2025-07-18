// src/pages/MyPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';

function MyPage() {
  const [user, setUser] = useState(null); // 사용자 정보를 담을 state
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // 페이지가 렌더링될 때 한 번만 실행되는 함수
    const fetchUserData = async () => {
      try {
        // API 명세서의 '내 정보 조회' API 호출
        const response = await apiClient.get('/users/me');
        setUser(response.data); // 성공 시 사용자 정보를 state에 저장
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchUserData();
  }, []); // 빈 배열을 전달하여 최초 렌더링 시에만 실행되도록 함

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography>사용자 정보를 찾을 수 없습니다.</Typography>;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          내 정보
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">이름: {user.name}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>이메일: {user.email}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>역할: {user.role}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default MyPage;