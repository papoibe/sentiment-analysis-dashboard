import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';

// MainLayout — wrapper chính cho tất cả trang sau login
// Kiểm tra auth: nếu chưa login → redirect /login
// Gồm: Sidebar (trái) + Header (trên) + Content (Outlet)
const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // Đang load localStorage → hiện loading
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Chưa đăng nhập → redirect login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          {/* Outlet render page con theo route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
