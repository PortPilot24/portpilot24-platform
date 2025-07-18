import { useState } from 'react';
// useNavigate와 함께 react-router-dom의 Link를 RouterLink라는 별명으로 가져옵니다.
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // Zustand 스토어
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link, // MUI의 Link 컴포넌트
} from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Zustand 스토어의 login 함수 가져오기

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // API 호출은 직접 하지 않고, 스토어의 login 함수를 통해 처리
      await login(email, password);

      alert('로그인 되었습니다.');
      navigate('/posts'); // 로그인 성공 시 게시판 페이지로 이동
    } catch (error) {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          {/* --- 아래 Grid 부분을 수정했습니다. --- */}
          <Grid container justifyContent="flex-end" columnGap={2}>
            {/* 'item'과 'xs' prop을 제거하고, component와 to 속성을 사용합니다. */}
            <Grid>
              <Link
                component={RouterLink}
                to="/request-password-reset"
                variant="body2"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </Grid>
            <Grid>
              <Link component={RouterLink} to="/signup" variant="body2">
                계정이 없으신가요? 회원가입
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;