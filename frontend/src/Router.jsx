// src/Router.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Route가 모든 페이지를 감싸는 부모 역할을 함 */}
        <Route element={<Layout />}>
          {/* 기본 경로(/)로 접속 시 /login으로 자동 이동시키는 라우트 */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/me" element={<MyPage />} />
          <Route path="/posts" element={<div>게시판 목록</div>} />
          <Route path="/posts/:id" element={<div>게시판 상세</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;