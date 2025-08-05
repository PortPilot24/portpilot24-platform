// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axios';
import PrivacyPolicy from '../components/PrivacyPolicy';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Grid,
  Link,
  Paper,
  Avatar,
} from '@mui/material';
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function SignupPage() {
  // 약관 동의 플래그 + 폼 상태
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const navigate = useNavigate();

  // 1) 아직 약관에 동의하지 않았으면 PrivacyPolicy 컴포넌트로
  if (!agreeTerms) {
    return <PrivacyPolicy onAgree={() => setAgreeTerms(true)} />;
  }

  // 2) 약관 동의 후 표시되는 가입 폼
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단 유효성 검사
    if (!email.includes('@')) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      // agreeTerms 를 반드시 서버로 전달
      await apiClient.post('/users/signup', {
        name,
        email,
        password,
        agreeTerms,
      });
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      // 서버 에러 메시지가 있으면 보여주고, 없으면 기본 문구
      const msg = err.response?.data?.message
        ?? '회원가입 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  return (
    <>
      {/* 회색 배경 + 중앙 카드 */}
      <Container disableGutters maxWidth={false}>
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            py: 8,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: { xs: '92%', sm: 520 },
              p: 5,
              borderRadius: 3,
            }}
          >
            {/* 카드 헤더 */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{ m: 'auto', bgcolor: 'primary.main', width: 64, height: 64 }}
              >
                <DirectionsBoatIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
                PortPilot24
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                지능형 항만 운영 플랫폼
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
                회원가입
              </Typography>
            </Box>

            {/* 가입 폼 */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="이름"
                  name="name"
                  autoComplete="name"
                  required
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="이메일 주소"
                  name="email"
                  autoComplete="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="비밀번호"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 1.5, height: 44 }}
              >
                가입하기
              </Button>

              <Grid container justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  이미 계정이 있으신가요?{' '}
                  <Link component={RouterLink} to="/login" underline="hover">
                    로그인
                  </Link>
                </Typography>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
