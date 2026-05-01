import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute — Chặn truy cập nếu chưa login hoặc không đúng role
// Props:
//   children: component con cần bảo vệ
//   allowedRoles: mảng role được phép truy cập (VD: ['ADMIN', 'MANAGER'])
//                 nếu không truyền → chỉ cần đăng nhập là được
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Đang load auth từ localStorage → hiển thị loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Chưa đăng nhập → redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Đã login nhưng role không được phép → redirect về trang mặc định của role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect theo role hiện tại
    const roleDefaultPath = {
      ANALYST: '/dashboard',
      MANAGER: '/data-sources',
      ADMIN: '/users',
    };
    return <Navigate to={roleDefaultPath[user?.role] || '/dashboard'} replace />;
  }

  // Đã login + đúng role → render children
  return children;
};

export default ProtectedRoute;
