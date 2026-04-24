import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

// Cấu hình menu theo role — tham khảo Frontend-Guide.md mục 4.2
const menuConfig = {
  ANALYST: [
    {
      icon: '📊', label: 'Dashboard', path: '/dashboard',
    },
    {
      icon: '💬', label: 'Reviews', children: [
        { label: 'Danh sách', path: '/reviews' },
        { label: 'Top Reviews', path: '/reviews/top' },
      ],
    },
    {
      icon: '📄', label: 'Báo cáo', children: [
        { label: 'Export', path: '/reports' },
        { label: 'Custom Reports', path: '/reports/custom' },
      ],
    },
  ],
  MANAGER: [
    {
      icon: '🗄️', label: 'Nguồn dữ liệu', children: [
        { label: 'Danh sách', path: '/data-sources' },
        { label: 'Import', path: '/data-sources/import' },
      ],
    },
    {
      icon: '💬', label: 'Quản lý Review', path: '/review-management',
    },
    {
      icon: '📋', label: 'Theo dõi xử lý', path: '/review-tracking',
    },
    {
      icon: '🔔', label: 'Cảnh báo', path: '/alerts',
    },
  ],
  ADMIN: [
    {
      icon: '👥', label: 'Người dùng', children: [
        { label: 'Danh sách', path: '/users' },
        { label: 'Tạo mới', path: '/users/create' },
      ],
    },
    {
      icon: '⚙️', label: 'Cài đặt', children: [
        { label: 'Hệ thống', path: '/settings' },
        { label: 'AI Config', path: '/settings/ai' },
        { label: 'Keywords', path: '/settings/keywords' },
      ],
    },
    {
      icon: '📊', label: 'Báo cáo hệ thống', path: '/system-reports',
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
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
              {item.children && (
                <span className={`${styles.arrow} ${openMenus[index] ? styles.open : ''}`}>
                  ▼
                </span>
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
