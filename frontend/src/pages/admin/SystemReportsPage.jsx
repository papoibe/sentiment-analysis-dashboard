import { useState, useEffect } from 'react';
import StatCard from '../../components/Cards/StatCard';
import styles from './SystemReportsPage.module.css';
import { getSystemStats } from '../../services/adminService';
import api from '../../services/api';

// SVG Icons
import usersIcon from '../../assets/icons/users.svg';
import reviewsIcon from '../../assets/icons/reviews.svg';
import aiRobotIcon from '../../assets/icons/ai-robot.svg';
import dataSourceIcon from '../../assets/icons/data-source.svg';
import alertIcon from '../../assets/icons/alert.svg';
import notificationIcon from '../../assets/icons/notification.svg';

// System Reports — Admin (thông báo lưu backend)
const SystemReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Modal tạo thông báo
  const [showModal, setShowModal] = useState(false);
  const [newNotify, setNewNotify] = useState({ title: '', type: 'info' });

  // Gọi API lấy system stats + notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dùng allSettled để 1 API fail không ảnh hưởng API khác
        const [statsRes, notiRes] = await Promise.allSettled([
          getSystemStats(),
          api.get('/v1/notifications')  // Đúng path backend: /api/v1/notifications
        ]);
        // Stats
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(statsRes.value.data);
        }
        // Notifications
        if (notiRes.status === 'fulfilled') {
          const notiData = notiRes.value?.data?.data || notiRes.value?.data || [];
          setNotifications(Array.isArray(notiData) ? notiData : []);
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng:', err.message);
      }
    };
    fetchData();
  }, []);

  // Tạo thông báo mới → lưu vào backend
  const handleCreateNotify = async () => {
    if (!newNotify.title.trim()) return;
    try {
      const res = await api.post('/v1/notifications', {
        title: newNotify.title,
        type: newNotify.type,
        channel: 'IN_APP',
      });
      const created = res?.data?.data || res?.data;
      setNotifications((prev) => [created, ...prev]);
    } catch (err) {
      // Fallback local nếu API lỗi
      setNotifications((prev) => [{ id: Date.now(), title: newNotify.title, type: newNotify.type, sentAt: new Date().toISOString() }, ...prev]);
    }
    setNewNotify({ title: '', type: 'info' });
    setShowModal(false);
  };

  // Xóa thông báo → xóa từ backend
  const handleDeleteNotify = async (id) => {
    try {
      await api.delete(`/v1/notifications/${id}`);
    } catch (err) { console.warn('Xóa notification lỗi:', err.message); }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Helper hiển thị thời gian
  const formatTime = (sentAt) => {
    if (!sentAt) return '';
    const diff = Date.now() - new Date(sentAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Báo Cáo Hệ Thống</h1>

      {/* 4 Stat Cards — dữ liệu thật từ API /reports/system */}
      <div className={styles.statsGrid}>
        <StatCard icon={usersIcon} label="Tổng Users" value={stats ? String(stats.total_users) : '...'} color="#0EA5E9" trend={2} />
        <StatCard icon={reviewsIcon} label="Tổng Reviews" value={stats ? String(stats.total_reviews) : '...'} color="#22C55E" trend={15} />
        <StatCard icon={aiRobotIcon} label="AI Analyzed" value={stats ? String(stats.total_sentiment_analyzed) : '...'} color="#D4A843" trend={-3} />
        <StatCard icon={dataSourceIcon} label="Data Sources" value={stats ? String(stats.total_data_sources) : '...'} color="#8B5CF6" trend={1} />
      </div>

      {/* Thông báo */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Thông báo hệ thống</h2>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Tạo thông báo</button>
        </div>
        <div className={styles.notifyList}>
          {notifications.map((n) => (
            <div key={n.id} className={`${styles.notifyItem} ${styles[n.type]}`}>
              <div className={styles.notifyIcon}>
                {n.type === 'warning' ? <img src={alertIcon} alt="" style={{ width: '18px', height: '18px' }} /> : n.type === 'alert' ? <img src={notificationIcon} alt="" style={{ width: '18px', height: '18px' }} /> : <img src={notificationIcon} alt="" style={{ width: '18px', height: '18px', opacity: 0.6 }} />}
              </div>
              <div className={styles.notifyContent}>
                <p className={styles.notifyTitle}>{n.title}</p>
                <span className={styles.notifyTime}>{formatTime(n.sentAt || n.time)}</span>
              </div>
              <button className={styles.deleteNotifyBtn} onClick={() => handleDeleteNotify(n.id)} title="Xóa">✕</button>
            </div>
          ))}
          {notifications.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>Không có thông báo nào</p>}
        </div>
      </div>

      {/* Modal tạo thông báo */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Tạo Thông Báo Mới</h3>
            <div className={styles.modalForm}>
              <div className={styles.modalField}>
                <label>Nội dung thông báo</label>
                <input value={newNotify.title} onChange={(e) => setNewNotify({ ...newNotify, title: e.target.value })} placeholder="Nhập nội dung..." />
              </div>
              <div className={styles.modalField}>
                <label>Loại thông báo</label>
                <select value={newNotify.type} onChange={(e) => setNewNotify({ ...newNotify, type: e.target.value })}>
                  <option value="info">Thông tin</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="alert">Khẩn cấp</option>
                </select>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowModal(false)}>Hủy</button>
              <button className={styles.modalConfirm} onClick={handleCreateNotify}>Tạo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemReportsPage;
