import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import styles from './ReportsPage.module.css';

// Reports & Export — Analyst
// Tham khảo: Frontend-Guide.md Trang 5
const ReportsPage = () => {
  const [format, setFormat] = useState('PDF');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [includeItems, setIncludeItems] = useState({
    dashboard: true,
    trend: true,
    reviews: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  // Mock custom reports
  const customReports = [
    { id: 1, name: 'Báo cáo Tháng 3', metrics: 'All', createdAt: '2026-03-31', format: 'PDF' },
    { id: 2, name: 'Top Negative Q1', metrics: 'Negative Only', createdAt: '2026-03-15', format: 'Excel' },
    { id: 3, name: 'Trend Analysis', metrics: 'Trend', createdAt: '2026-03-01', format: 'PDF' },
  ];

  const handleExport = () => {
    setExporting(true);
    // Giả lập export (TODO: gọi API thật)
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    }, 2000);
  };

  const toggleItem = (key) => {
    setIncludeItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const columns = [
    { key: 'name', label: 'Tên báo cáo' },
    { key: 'metrics', label: 'Nội dung' },
    { key: 'format', label: 'Định dạng' },
    { key: 'createdAt', label: 'Ngày tạo' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Xuất Báo Cáo</h1>

      {/* Export Form */}
      <div className={styles.exportCard}>
        <h2 className={styles.sectionTitle}>Tạo báo cáo mới</h2>

        <div className={styles.formGrid}>
          {/* Định dạng */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Định dạng</label>
            <div className={styles.radioGroup}>
              {['PDF', 'Excel'].map((f) => (
                <label key={f} className={`${styles.radioLabel} ${format === f ? styles.radioActive : ''}`}>
                  <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} />
                  {f === 'PDF' ? '📄' : '📊'} {f}
                </label>
              ))}
            </div>
          </div>

          {/* Nội dung */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung</label>
            <div className={styles.checkboxGroup}>
              {[
                { key: 'dashboard', label: 'Dashboard Summary' },
                { key: 'trend', label: 'Trend Chart' },
                { key: 'reviews', label: 'Reviews List' },
              ].map((item) => (
                <label key={item.key} className={styles.checkboxLabel}>
                  <input type="checkbox" checked={includeItems[item.key]} onChange={() => toggleItem(item.key)} />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Khoảng thời gian</label>
            <div className={styles.dateRange}>
              <input type="date" className={styles.dateInput} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <span>→</span>
              <input type="date" className={styles.dateInput} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        <button className={styles.exportBtn} onClick={handleExport} disabled={exporting}>
          {exporting ? '⏳ Đang xuất...' : exportDone ? '✅ Xuất thành công!' : '📥 XUẤT BÁO CÁO'}
        </button>
      </div>

      {/* Custom Reports */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>Custom Reports</h2>
      <DataTable
        columns={columns}
        data={customReports}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem">👁</button>
            <button className={styles.actionBtn} title="Tải">📥</button>
            <button className={styles.actionBtn} title="Xóa">🗑</button>
          </>
        )}
      />
    </div>
  );
};

export default ReportsPage;
