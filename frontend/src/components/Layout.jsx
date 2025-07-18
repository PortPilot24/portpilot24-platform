// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div>
      <Header />
      <main>
        {/* 이 부분에 각 페이지의 내용이 렌더링됩니다. */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;