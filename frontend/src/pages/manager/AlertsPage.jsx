import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './AlertsPage.module.css';

// Alerts — Manager
// Tham khảo: Frontend-Guide.md Trang 9
const AlertsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '', condition: 'NEGATIVE_SPIKE', threshold: 10, active: true,
  });

  // Mock alerts data
  const alerts = [
    { id: 1, name: 'Negative Spike Alert', condition: 'Negative > 10/ngày', status: 'ACTIVE', triggered: 3, lastTriggered: '2026-04-18' },
    { id: 2, name: 'Low Confidence Alert', condition: 'Confidence < 60%', status: 'ACTIVE', triggered: 1, lastTriggered: '2026-04-15' },
    { id: 3, name: 'New Source Alert', condition: 'DataSource mới', status: 'INACTIVE', triggered: 0, lastTriggered: '—' },
  ];

  const columns = [
    { key: 'name', label: 'Tên Rule' },
    { key: 'condition', label: 'Điều kiện' },
    { key: 'status', label: 'Trạng thái',
      render: (val) => <Badge type={val === 'ACTIVE' ? 'positive' : 'neutral'}>{val}</Badge> },
    { key: 'triggered', label: 'Lần kích hoạt' },
    { key: 'lastTriggered', label: 'Lần cuối' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Cảnh Báo</h1>

      <div className={styles.headerRow}>
        <p className={styles.subtitle}>Quản lý các rule cảnh báo tự động</p>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Đóng' : '+ Tạo Rule'}
        </button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Tạo Rule Mới</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Tên rule</label>
              <input className={styles.input} value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="VD: Negative Spike Alert" />
            </div>
            <div className={styles.formGroup}>
              <label>Điều kiện</label>
              <select className={styles.select} value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}>
                <option value="NEGATIVE_SPIKE">Negative tăng đột biến</option>
                <option value="LOW_CONFIDENCE">Confidence thấp</option>
                <option value="NEW_SOURCE">DataSource mới được thêm</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ngưỡng</label>
              <input className={styles.input} type="number" value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
            <button className={styles.saveBtn} onClick={() => setShowForm(false)}>💾 Lưu Rule</button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={alerts}
        actions={() => (
          <>
            <button className={styles.actionBtn}>✏️</button>
            <button className={styles.actionBtn}>🗑</button>
          </>
        )}
      />
    </div>
  );
};

export default AlertsPage;
