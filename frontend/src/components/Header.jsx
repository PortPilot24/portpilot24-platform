// src/components/Header.jsx
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header() {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* 로고 또는 앱 이름 */}
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          PortPilot24
        </Typography>

        {/* 로그인 상태에 따라 다른 버튼들을 보여줌 */}
        {isLoggedIn ? (
          // 로그인 된 상태
          <Box>
            <Button color="inherit" component={RouterLink} to="/me">
              내 정보
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              로그아웃
            </Button>
          </Box>
        ) : (
          // 로그아웃 된 상태
          <Box>
            <Button color="inherit" component={RouterLink} to="/login">
              로그인
            </Button>
            <Button color="inherit" component={RouterLink} to="/signup">
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;