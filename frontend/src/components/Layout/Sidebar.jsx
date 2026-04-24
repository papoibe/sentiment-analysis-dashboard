import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

// Import SVG icons từ assets/icons (Hào đã tạo)
import dashboardIcon from '../../assets/icons/dashboard.svg';
import reviewsIcon from '../../assets/icons/reviews.svg';
import reportsIcon from '../../assets/icons/reports.svg';
import dataSourceIcon from '../../assets/icons/data-source.svg';
import flagIcon from '../../assets/icons/flag.svg';
import assignIcon from '../../assets/icons/assign.svg';
import alertIcon from '../../assets/icons/alert.svg';
import usersIcon from '../../assets/icons/users.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import chevronIcon from '../../assets/icons/chevron-down.svg';

// Cấu hình menu theo role — tham khảo Frontend-Guide.md mục 4.2
const menuConfig = {
  ANALYST: [
    {
      icon: dashboardIcon, label: 'Dashboard', path: '/dashboard',
    },
    {
      icon: reviewsIcon, label: 'Reviews', children: [
        { label: 'Danh sách', path: '/reviews' },
        { label: 'Top Reviews', path: '/reviews/top' },
      ],
    },
    {
      icon: reportsIcon, label: 'Báo cáo', children: [
        { label: 'Export', path: '/reports' },
        { label: 'Custom Reports', path: '/reports/custom' },
      ],
    },
  ],
  MANAGER: [
    {
      icon: dataSourceIcon, label: 'Nguồn dữ liệu', children: [
        { label: 'Danh sách', path: '/data-sources' },
        { label: 'Import', path: '/data-sources/import' },
      ],
    },
    {
      icon: reviewsIcon, label: 'Quản lý Review', path: '/review-management',
    },
    {
      icon: assignIcon, label: 'Theo dõi xử lý', path: '/review-tracking',
    },
    {
      icon: alertIcon, label: 'Cảnh báo', path: '/alerts',
    },
  ],
  ADMIN: [
    {
      icon: usersIcon, label: 'Người dùng', children: [
        { label: 'Danh sách', path: '/users' },
        { label: 'Tạo mới', path: '/users/create' },
      ],
    },
    {
      icon: settingsIcon, label: 'Cài đặt', children: [
        { label: 'Hệ thống', path: '/settings' },
        { label: 'AI Config', path: '/settings/ai' },
        { label: 'Keywords', path: '/settings/keywords' },
      ],
    },
    {
      icon: reportsIcon, label: 'Báo cáo hệ thống', path: '/system-reports',
    },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại để đánh dấu active
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({}); // Theo dõi sub-menu nào đang mở

  const role = user?.role || 'ANALYST';
  const menus = menuConfig[role] || menuConfig.ANALYST;

  // Toggle mở/đóng sub-menu
  const toggleSubMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Kiểm tra path có active không
  const isActive = (path) => location.pathname === path;
  const isGroupActive = (item) => {
    if (item.path) return isActive(item.path);
    return item.children?.some((child) => isActive(child.path));
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>S</div>
        <span className={styles.logoText}>SAD</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menus.map((item, index) => (
          <div key={index} className={styles.menuGroup}>
            {/* Menu item chính */}
            <button
              className={`${styles.menuItem} ${isGroupActive(item) ? styles.active : ''}`}
              onClick={() => {
                if (item.children) {
                  toggleSubMenu(index);
                } else {
                  navigate(item.path);
                }
              }}
            >
              {/* SVG icon thay cho emoji */}
              <img src={item.icon} alt={item.label} className={styles.menuIconSvg} />
              <span className={styles.menuLabel}>{item.label}</span>
              {item.children && (
                <img
                  src={chevronIcon}
                  alt="expand"
                  className={`${styles.arrowSvg} ${openMenus[index] ? styles.open : ''}`}
                />
              )}
            </button>

            {/* Sub-menu */}
            {item.children && (
              <div className={`${styles.subMenu} ${openMenus[index] ? styles.open : ''}`}>
                {item.children.map((child, childIdx) => (
                  <button
                    key={childIdx}
                    className={`${styles.subMenuItem} ${isActive(child.path) ? styles.active : ''}`}
                    onClick={() => navigate(child.path)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Toggle collapse */}
      <button className={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '▶' : '≡'}
      </button>
    </aside>
  );
};

export default Sidebar;
