import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 나중에 만들 페이지 컴포넌트들을 미리 import 합니다.
// import LoginPage from './pages/LoginPage';
// import BoardListPage from './pages/BoardListPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로는 게시판 목록으로 설정 */}
        {/* <Route path="/" element={<BoardListPage />} /> */}
        <Route path="/login" element={<div>로그인 페이지</div>} />
        <Route path="/signup" element={<div>회원가입 페이지</div>} />
        <Route path="/posts" element={<div>게시판 목록</div>} />
        <Route path="/posts/:id" element={<div>게시판 상세</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;