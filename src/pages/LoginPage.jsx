// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // TODO: 로그인 API 호출
    console.log("signin:", { email, password });
  };

  return (
    <Box
      sx={{
        // 브라우저 전체 높이에서 AppBar 높이(64px)만큼 뺌
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,  // 좌우 여백
        backgroundImage: `url("/assets/port-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 700,            // 최대 너비
          p: 6,                     // 패딩
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(4px)",
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              m: "auto",
              bgcolor: "primary.main",
              width: 80,
              height: 80,
            }}
          >
            <DirectionsBoatIcon fontSize="large" />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            PortPilot24
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            지능형 항만 운영 플랫폼
          </Typography>
        </Box>

        <TextField
          label="이메일 주소"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4, py: 2, fontWeight: "bold", fontSize: "1.1rem" }}
          onClick={handleSignIn}
        >
          로그인
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <Link href="/password-reset" variant="body1" underline="hover">
            비밀번호를 잊으셨나요?
          </Link>
          <Link href="/signup" variant="body1" underline="hover">
            회원가입
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
