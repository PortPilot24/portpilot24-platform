// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axios';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
  Paper,
  Avatar,
} from '@mui/material';
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 유효성 검사
    if (!email.includes('@')) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (!agreeTerms) {
      alert('약관에 동의해주세요.');
      return;
    }

    try {
      await apiClient.post('/users/signup', {
        name,
        email,
        password,
        agreeTerms,
      });
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error('Signup error:', error);
    }
  };

  return (
    <>
      {/* 배경 + 중앙 카드 */}
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

            {/* 폼 */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="이름"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'grey.50',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: 'grey.300' },
                      '&:hover fieldset': { borderColor: 'grey.400' },
                      '&.Mui-focused fieldset': { borderColor: 'grey.500' },
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="이메일 주소"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'grey.50',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: 'grey.300' },
                      '&:hover fieldset': { borderColor: 'grey.400' },
                      '&.Mui-focused fieldset': { borderColor: 'grey.500' },
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="비밀번호"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'grey.50',
                      borderRadius: 1.5,
                      '& fieldset': { borderColor: 'grey.300' },
                      '&:hover fieldset': { borderColor: 'grey.400' },
                      '&.Mui-focused fieldset': { borderColor: 'grey.500' },
                    },
                  }}
                />

              </Stack>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!agreeTerms}
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

export default SignupPage;
