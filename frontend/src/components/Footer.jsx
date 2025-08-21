import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        backgroundColor: '#1976d2', // 헤더와 같은 파란색 (기본 MUI primary)
        color: 'white',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* 왼쪽 - 회사명 */}
        <Typography variant="body2">
          © {new Date().getFullYear()} PortPilot24
        </Typography>

        {/* 오른쪽 - 링크들 */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Link
            component={RouterLink}
            to="/privacy"
            color="inherit"
            underline="hover"
            variant="body2"
          >
            개인정보 처리방침
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
