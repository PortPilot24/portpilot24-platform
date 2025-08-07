import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios'; // ✅ 주석 해제
import { Container, Box, Typography, TextField, Button, Stack } from '@mui/material';

function PasswordResetPage() {
  const [searchParams] = useSearchParams(); // ✅ URL 쿼리 파라미터 추출
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ✅ 최초 렌더링 시 URL에서 token 파라미터 추출
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // ✅ 실제 API 요청
      await apiClient.post('/users/reset-password', { token, newPassword });
      alert('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      alert('비밀번호 변경 중 오류가 발생했습니다.');
      console.error('Password reset error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          새 비밀번호 설정
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              name="token"
              label="이메일로 받은 토큰"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled // ✅ URL로부터 자동 세팅된 토큰은 수정 불가하게
            />
            <TextField
              required
              fullWidth
              name="newPassword"
              label="새 비밀번호"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="새 비밀번호 확인"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Stack>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            비밀번호 변경하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default PasswordResetPage;
