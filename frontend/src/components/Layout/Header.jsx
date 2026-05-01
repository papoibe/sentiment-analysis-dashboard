import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import styles from './Header.module.css';

// SVG Icons
import notificationIcon from '../../assets/icons/notification.svg';
import usersIcon from '../../assets/icons/users.svg';
import passwordIcon from '../../assets/icons/password.svg';
import logoutIcon from '../../assets/icons/logout.svg';

// Map duong dan → ten breadcrumb tieng Viet
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

// Icon cho tung loai thong bao
const typeIcons = { info: '🔵', warning: '🟡', alert: '🔴', success: '🟢' };

// Format thoi gian tuong doi (vd: "2 phút trước")
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

const Header = () => {
  const { user, logoutAction } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false); // Notification dropdown
  const dropdownRef = useRef(null);
  const notiRef = useRef(null);

  // Dong dropdown khi click ra ngoai
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lay breadcrumb tu URL hien tai
  const crumbs = breadcrumbMap[location.pathname] || ['Trang chủ'];

  // Lay chu cai dau cua ten user lam avatar
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

      {/* Actions ben phai */}
      <div className={styles.actions}>
        {/* Notification bell + dropdown */}
        <div className={styles.notiWrapper} ref={notiRef}>
          <button
            className={styles.notifBtn}
            onClick={() => setNotiOpen(!notiOpen)}
            aria-label="Thông báo"
          >
            <img src={notificationIcon} alt="Thông báo" className={styles.notifIcon} />
            {unreadCount > 0 && (
              <span className={styles.notifBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel Dropdown */}
          <div className={`${styles.notiPanel} ${notiOpen ? styles.notiPanelOpen : ''}`}>
            <div className={styles.notiHeader}>
              <h4>Thông báo</h4>
              {unreadCount > 0 && (
                <button
                  className={styles.markAllBtn}
                  onClick={() => { markAllAsRead(); }}
                >
                  Đọc tất cả
                </button>
              )}
            </div>
            <div className={styles.notiList}>
              {notifications.length === 0 ? (
                <div className={styles.notiEmpty}>Không có thông báo</div>
              ) : (
                notifications.slice(0, 20).map((noti) => (
                  <div
                    key={noti.id}
                    className={`${styles.notiItem} ${
                      !noti.isRead && !noti.read ? styles.notiUnread : ''
                    }`}
                    onClick={() => {
                      if (!noti.isRead && !noti.read) markAsRead(noti.id);
                    }}
                  >
                    <span className={styles.notiIcon}>
                      {typeIcons[noti.type] || typeIcons.info}
                    </span>
                    <div className={styles.notiContent}>
                      <div className={styles.notiTitle}>{noti.title}</div>
                      <div className={styles.notiTime}>
                        {timeAgo(noti.sentAt || noti.createdAt)}
                      </div>
                    </div>
                    {!noti.isRead && !noti.read && (
                      <span className={styles.notiDot} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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
