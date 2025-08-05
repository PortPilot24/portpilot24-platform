// src/pages/SignupPage.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = () => {
    // TODO: 회원가입 API 호출
    console.log({ name, email, password, agree });
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",  // AppBar 높이(64px) 제외
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        backgroundImage: `url("/assets/port-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 6,
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(4px)",
          borderRadius: 3,
        }}
      >
        {/* 헤더 영역 */}
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
          <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
            PortPilot24
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            지능형 항만 운영 플랫폼
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "medium" }}>
            회원가입
          </Typography>
        </Box>

        {/* 입력 폼 */}
        <TextField
          label="이름"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
          }
          label="이용약관 및 개인정보 처리 방침에 동의합니다."
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 2, fontWeight: "bold", fontSize: "1.1rem" }}
          onClick={handleSignup}
          disabled={!agree}
        >
          가입하기
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>
            이미 계정이 있으신가요?
          </Typography>
          <Link href="/login" variant="body2" underline="hover">
            로그인
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
