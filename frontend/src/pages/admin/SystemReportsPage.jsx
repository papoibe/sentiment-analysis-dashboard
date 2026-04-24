import StatCard from '../../components/Cards/StatCard';
import styles from './SystemReportsPage.module.css';

// System Reports — Admin
// Tham khảo: Frontend-Guide.md Trang 12
const SystemReportsPage = () => {
  return (
    <div>
      <h1 className={styles.pageTitle}>Báo Cáo Hệ Thống</h1>

      {/* 4 Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard icon="👥" label="Tổng Users" value="5" color="#0EA5E9" trend={2} />
        <StatCard icon="💬" label="Tổng Reviews" value="1,247" color="#22C55E" trend={15} />
        <StatCard icon="🤖" label="API Usage" value="842" color="#D4A843" trend={-3} />
        <StatCard icon="📂" label="Data Sources" value="4" color="#8B5CF6" trend={1} />
      </div>

      {/* Thông báo */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Thông báo hệ thống</h2>
          <button className={styles.addBtn}>+ Tạo thông báo</button>
        </div>
        <div className={styles.notifyList}>
          {[
            { id: 1, title: 'Hệ thống đã cập nhật phiên bản 1.0.0', time: '2 giờ trước', type: 'info' },
            { id: 2, title: 'OpenAI API key sắp hết quota', time: '5 giờ trước', type: 'warning' },
            { id: 3, title: 'User analyst2 vừa được tạo', time: '1 ngày trước', type: 'info' },
            { id: 4, title: '3 reviews bị flag cần xử lý', time: '2 ngày trước', type: 'alert' },
          ].map((n) => (
            <div key={n.id} className={`${styles.notifyItem} ${styles[n.type]}`}>
              <div className={styles.notifyIcon}>
                {n.type === 'warning' ? '⚠️' : n.type === 'alert' ? '🔔' : 'ℹ️'}
              </div>
              <div className={styles.notifyContent}>
                <p className={styles.notifyTitle}>{n.title}</p>
                <span className={styles.notifyTime}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemReportsPage;
