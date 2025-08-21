import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GlobalSnackbar from './GlobalSnackbar'; // Snackbar import

function Layout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // 화면 전체 높이 확보
      }}
    >
      <Header />
      <GlobalSnackbar /> {/* 앱 전체에 알림을 띄우기 위해 여기에 추가 */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;