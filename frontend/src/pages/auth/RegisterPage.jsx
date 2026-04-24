import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import styles from './AuthPages.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      // Gọi API POST /api/auth/register
      await register({
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      // Đăng ký thành công → chuyển sang login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
          Tạo tài khoản để bắt đầu phân tích
        </p>
      </div>

      {/* Cột phải — form đăng ký */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.formLogo}>
            <div className={styles.formLogoIcon}>S</div>
            <span className={styles.formLogoText}>SAD</span>
          </div>

          <h2 className={styles.formTitle}>Đăng ký</h2>
          <p className={styles.formSubtitle}>Tạo tài khoản mới</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Họ và tên</label>
              <input
                id="register-fullname"
                className={styles.formInput}
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                id="register-email"
                className={styles.formInput}
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tên đăng nhập</label>
              <input
                id="register-username"
                className={styles.formInput}
                type="text"
                name="username"
                placeholder="Nhập username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Mật khẩu</label>
              <input
                id="register-password"
                className={styles.formInput}
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Xác nhận mật khẩu</label>
              <input
                id="register-confirm"
                className={styles.formInput}
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
