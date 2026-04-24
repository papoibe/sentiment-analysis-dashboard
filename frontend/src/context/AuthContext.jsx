import { createContext, useContext, useState, useEffect } from 'react';

// Context lưu trạng thái auth (user, token) — dùng React Context API
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, username, fullName, email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // loading ban đầu khi check localStorage

  // Khởi tạo: đọc từ localStorage khi app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Hàm login — lưu token + user vào state và localStorage
  // AuthResponse từ backend: { accessToken, tokenType, expiresIn, user }
  const loginAction = (data) => {
    const token = data.accessToken || data.token; // accessToken từ backend
    const user = data.user || data;
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Hàm logout — xóa tất cả
  const logoutAction = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, loginAction, logoutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dùng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
};

export default AuthContext;
