import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import styles from './AuthPages.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API POST /api/auth/login
      // Backend nhận field "usernameOrEmail" (không phải "username")
      const data = await login({ usernameOrEmail: username, password });
      loginAction(data); // Lưu token + user vào context

      // Redirect theo role sau khi login thành công
      const role = data.user?.role || data.role;
      if (role === 'ADMIN') navigate('/users');
      else if (role === 'MANAGER') navigate('/data-sources');
      else navigate('/dashboard'); // ANALYST mặc định
    } catch (err) {
      setError(err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Cột trái — gradient trang trí */}
      <div className={styles.leftPanel}>
        <h1 className={styles.leftTitle}>SAD</h1>
        <p className={styles.leftSubtitle}>
          Sentiment Analysis Dashboard<br />
          Hệ thống phân tích cảm xúc đánh giá khách hàng
        </p>
      </div>

      {/* Cột phải — form đăng nhập */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          {/* Logo */}
          <div className={styles.formLogo}>
            <div className={styles.formLogoIcon}>S</div>
            <span className={styles.formLogoText}>SAD</span>
          </div>

          <h2 className={styles.formTitle}>Đăng nhập</h2>
          <p className={styles.formSubtitle}>Nhập thông tin tài khoản để tiếp tục</p>

          {/* Hiển thị lỗi */}
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tên đăng nhập</label>
              <input
                id="login-username"
                className={styles.formInput}
                type="text"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mật khẩu</label>
              <input
                id="login-password"
                className={styles.formInput}
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <span className={styles.forgotLink}>Quên mật khẩu?</span>
            </div>

            <button
              id="login-submit"
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
