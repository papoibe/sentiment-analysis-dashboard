import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

// SVG Icons
import notificationIcon from '../../assets/icons/notification.svg';
import usersIcon from '../../assets/icons/users.svg';
import passwordIcon from '../../assets/icons/password.svg';
import logoutIcon from '../../assets/icons/logout.svg';

// Map đường dẫn → tên breadcrumb tiếng Việt
const breadcrumbMap = {
  '/dashboard': ['Dashboard', 'Tổng quan'],
  '/reviews': ['Reviews', 'Danh sách'],
  '/reviews/top': ['Reviews', 'Top Reviews'],
  '/reports': ['Báo cáo', 'Export'],
  '/reports/custom': ['Báo cáo', 'Custom Reports'],
  '/data-sources': ['Nguồn dữ liệu', 'Danh sách'],
  '/data-sources/import': ['Nguồn dữ liệu', 'Import'],
  '/review-management': ['Quản lý Review', 'Danh sách'],
  '/review-tracking': ['Theo dõi xử lý', 'Danh sách'],
  '/alerts': ['Cảnh báo', 'Cấu hình'],
  '/users': ['Người dùng', 'Danh sách'],
  '/users/create': ['Người dùng', 'Tạo mới'],
  '/settings': ['Cài đặt', 'Hệ thống'],
  '/settings/ai': ['Cài đặt', 'AI Config'],
  '/settings/keywords': ['Cài đặt', 'Keywords'],
  '/system-reports': ['Báo cáo hệ thống', 'Tổng quan'],
};

const Header = () => {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lấy breadcrumb từ URL hiện tại
  const crumbs = breadcrumbMap[location.pathname] || ['Trang chủ'];

  // Lấy chữ cái đầu của tên user làm avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        {crumbs.map((crumb, i) => (
          <span key={i}>
            {i > 0 && <span style={{ color: 'var(--text-secondary)', margin: '0 2px' }}>/</span>}
            <span style={i === crumbs.length - 1 ? { fontWeight: 600, color: 'var(--text-primary)' } : {}}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Actions bên phải */}
      <div className={styles.actions}>
        {/* Notification bell */}
        <button className={styles.notifBtn}>
          <img src={notificationIcon} alt="Thông báo" className={styles.notifIcon} />
          <span className={styles.notifBadge}>3</span>
        </button>

        {/* Avatar + Dropdown */}
        <div className={styles.userInfo} ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.userName}>{user?.fullName || 'User'}</div>
            <div className={styles.userRole}>{user?.role || 'ANALYST'}</div>
          </div>

          {/* Dropdown menu */}
          <div className={`${styles.dropdown} ${dropdownOpen ? styles.open : ''}`}>
            <div className={styles.dropdownHeader}>
              <div className={styles.dropdownName}>{user?.fullName || 'User'}</div>
              <div className={styles.dropdownEmail}>{user?.email || 'user@email.com'}</div>
            </div>
            <button className={styles.dropdownItem} onClick={() => navigate('/profile')}>
              <img src={usersIcon} alt="" className={styles.dropdownIcon} /> Thông tin người dùng
            </button>
            <button className={styles.dropdownItem} onClick={() => navigate('/change-password')}>
              <img src={passwordIcon} alt="" className={styles.dropdownIcon} /> Đổi mật khẩu
            </button>
            <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={handleLogout}>
              <img src={logoutIcon} alt="" className={styles.dropdownIcon} /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
