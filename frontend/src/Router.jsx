// src/Router.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import PasswordRequestPage from './pages/PasswordRequestPage';
import PasswordResetPage from './pages/PasswordResetPage'; // 비밀번호 변경 페이지 import 추가

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route가 모든 페이지를 감싸는 부모 역할을 함 */}
        <Route element={<Layout />}>
          {/* 기본 경로(/)로 접속 시 /login으로 자동 이동시키는 라우트 */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 누구나 접근 가능한 페이지 */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/request-password-reset" element={<PasswordRequestPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />

          {/* 로그인이 필요한 페이지 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/me" element={<MyPage />} />
            <Route path="/posts" element={<div>게시판 목록</div>} />
            <Route path="/posts/:id" element={<div>게시판 상세</div>} />
            {/* 게시글 작성 등 로그인이 필요한 다른 페이지들도 여기에 추가 */}
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;