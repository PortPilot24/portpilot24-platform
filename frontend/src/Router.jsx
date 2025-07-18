import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ProtectedRoute from './components/ProtectedRoute';
import PasswordRequestPage from './pages/PasswordRequestPage';
import PasswordResetPage from './pages/PasswordResetPage';
import BoardListPage from './pages/BoardListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* 기본 경로(/)로 접속 시 /login으로 자동 이동시키는 라우트 */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 누구나 접근 가능한 페이지 */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/request-password-reset" element={<PasswordRequestPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />

          {/* 로그인이 필요한 페이지 (게시판 경로들을 다시 안으로 이동) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/me" element={<MyPage />} />
            <Route path="/posts" element={<BoardListPage />} />
            <Route path="/posts/new" element={<PostFormPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/:id/edit" element={<PostFormPage />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;