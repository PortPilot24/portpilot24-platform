import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore'; // 알림 스토어 import
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  CircularProgress,
  Avatar,
  Paper, // 로딩 스피너 import
} from '@mui/material';
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showNotification } = useNotificationStore(); // 알림 함수 가져오기

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // 로딩 시작

    try {
      await login(email, password);
      showNotification('로그인 되었습니다.', 'success');
      navigate('/dashboard');
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        showNotification('이메일 또는 비밀번호가 일치하지 않습니다.', 'error');
      } else if (status === 403) {
        showNotification('관리자 승인 후 로그인할 수 있습니다.', 'warning');
      } else {
        showNotification('로그인 중 오류가 발생했습니다.', 'error');
      }

      console.error('Login error:', error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',              // AppBar 높이 제외
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',                           // 화면 전체 연회색 배경
          p: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: { xs: '92%', sm: 520 },              // 카드 폭
            p: 4,                                       // 카드 안쪽 여백
            borderRadius: 2,
          }}
        >
          {/* 카드 헤더(아이콘 + 타이틀 + 서브타이틀) */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ m: 'auto', bgcolor: 'primary.main', width: 64, height: 64 }}>
              <DirectionsBoatIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
              PortPilot24
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              지능형 항만 운영 플랫폼
            </Typography>
          </Box>

          {/* 폼 영역 */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="이메일 주소"
              variant="filled"                               // 스샷처럼 Filled 스타일
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#e9f2ff',               // 연한 파란색 배경
                  borderRadius: 1.5,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                  '&:hover': { backgroundColor: '#e3eeff' },
                  '&:before, &:after': { borderBottom: 'none' }, // 밑줄 제거
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="비밀번호"
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{
                '& .MuiFilledInput-root': {
                  backgroundColor: '#e9f2ff',
                  borderRadius: 1.5,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                  '&:hover': { backgroundColor: '#e3eeff' },
                  '&:before, &:after': { borderBottom: 'none' },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2.5, mb: 1.5, height: 44 }}         // 파란 로그인 버튼
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
            </Button>

            {/* 하단 좌/우 링크 */}
            <Grid container justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Grid item>
                <Link component={RouterLink} to="/request-password-reset" variant="body2">
                  비밀번호를 잊으셨나요?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  회원가입
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;