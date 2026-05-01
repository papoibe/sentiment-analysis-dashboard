import { useState, useEffect } from 'react';
import DataTable from '../../components/Table/DataTable';
import styles from './ReportsPage.module.css';
import { getReports, exportReport, createReport, deleteReport } from '../../services/reportService';

// SVG Icons từ assets/icons
import fileIcon from '../../assets/icons/file.svg';
import dashboardIcon from '../../assets/icons/dashboard.svg';
import exportIcon from '../../assets/icons/export.svg';
import checkIcon from '../../assets/icons/check.svg';
import viewIcon from '../../assets/icons/view.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import alertIcon from '../../assets/icons/alert.svg';

// Reports & Export — Analyst
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
  const [exportError, setExportError] = useState('');

  // Danh sách báo cáo đã xuất (lấy từ database)
  const [customReports, setCustomReports] = useState([]);

  // Gọi API lấy danh sách custom reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        if (res?.data && Array.isArray(res.data)) {
          setCustomReports(res.data);
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng, dùng mockData:', err.message);
      }
    };
    fetchReports();
  }, []);

  // Tạo file download từ blob response — tạo <a> ẩn rồi click tự động
  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Tên file khi download
    document.body.appendChild(a);
    a.click();
    // Dọn dẹp: xóa URL object và element ẩn
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      // Gọi API export — backend trả blob binary (PDF/Excel) hoặc JSON
      const response = await exportReport({ format, dateFrom, dateTo });

      // Xác định tên file theo format được chọn
      const ext = format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase();
      const filename = `sentiment-report.${ext}`;

      if (format.toLowerCase() === 'json') {
        // JSON: tạo blob từ JSON text rồi download
        const jsonBlob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        triggerDownload(jsonBlob, 'sentiment-report.json');
      } else {
        // PDF/Excel: response.data đã là blob nhờ responseType: 'blob'
        triggerDownload(response.data, filename);
      }

      // Lưu record vào bảng Custom Reports (lịch sử xuất)
      const metrics = Object.entries(includeItems).filter(([, v]) => v).map(([k]) => k).join(', ');
      const reportName = `Báo cáo ${format} - ${new Date().toLocaleDateString('vi-VN')}`;
      try {
        const saved = await createReport({
          name: reportName,
          configJson: JSON.stringify({ format, dateFrom, dateTo, includeItems }),
        });
        // Thêm record mới vào bảng hiển thị ngay
        if (saved?.data) {
          setCustomReports((prev) => [saved.data, ...prev]);
        } else {
          // Fallback local
          setCustomReports((prev) => [{ id: Date.now(), name: reportName, metrics, format, createdAt: new Date().toISOString() }, ...prev]);
        }
      } catch (e) {
        // Fallback: thêm local nếu API lỗi
        setCustomReports((prev) => [{ id: Date.now(), name: reportName, metrics, format, createdAt: new Date().toISOString() }, ...prev]);
      }

      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) {
      console.error('Export lỗi:', err);
      setExportError('Xuất báo cáo thất bại. Vui lòng thử lại.');
      setTimeout(() => setExportError(''), 4000);
    } finally {
      setExporting(false);
    }
  };

  const toggleItem = (key) => {
    setIncludeItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // === Custom Reports Actions ===
  const [viewModal, setViewModal] = useState(null); // report đang xem
  const [deleteConfirm, setDeleteConfirm] = useState(null); // report cần xóa

  // Xem chi tiết: mở modal hiển thị configJson
  const handleView = (row) => {
    setViewModal(row);
  };

  // Tải lại: re-export theo config đã lưu
  const handleReDownload = async (row) => {
    try {
      const cfg = JSON.parse(row.configJson || '{}');
      const response = await exportReport({ format: cfg.format || 'PDF', dateFrom: cfg.dateFrom, dateTo: cfg.dateTo });
      const ext = (cfg.format || 'pdf').toLowerCase() === 'excel' ? 'xlsx' : (cfg.format || 'pdf').toLowerCase();
      triggerDownload(response.data, `${row.name}.${ext}`);
    } catch (err) {
      console.error('Tải lại lỗi:', err);
      alert('Không thể tải lại báo cáo này.');
    }
  };

  // Xóa report
  const handleDeleteReport = async () => {
    try {
      await deleteReport(deleteConfirm.id);
    } catch (err) {
      console.warn('API xóa lỗi:', err.message);
    }
    setCustomReports((prev) => prev.filter((r) => r.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const columns = [
    { key: 'name', label: 'Tên báo cáo' },
    {
      key: 'configJson', label: 'Nội dung',
      // configJson là JSON string chứa {format, includeItems,...} — parse và hiển thị
      render: (val) => {
        try {
          const cfg = JSON.parse(val);
          return Object.entries(cfg.includeItems || {}).filter(([, v]) => v).map(([k]) => k).join(', ') || cfg.format || val;
        } catch { return val || '—'; }
      },
    },
    {
      key: 'configJson', label: 'Định dạng',
      // Lấy format từ configJson
      render: (val) => {
        try { return JSON.parse(val).format || '—'; } catch { return '—'; }
      },
    },
    { key: 'createdAt', label: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '' },
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
                  <img src={f === 'PDF' ? fileIcon : dashboardIcon} alt="" style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '4px' }} /> {f}
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
          {exporting ? 'Đang xuất...' : exportDone ? <><img src={checkIcon} alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} />Xuất thành công!</> : <><img src={exportIcon} alt="" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} />XUẤT BÁO CÁO</>}
        </button>
        {exportError && <p style={{ color: 'var(--negative)', fontSize: '13px', marginTop: '8px' }}>{exportError}</p>}
      </div>

      {/* Custom Reports */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>Custom Reports</h2>
      <DataTable
        columns={columns}
        data={customReports}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem chi tiết" onClick={() => handleView(row)}><img src={viewIcon} alt="Xem" style={{ width: '14px', height: '14px' }} /></button>
            <button className={styles.actionBtn} title="Tải lại" onClick={() => handleReDownload(row)}><img src={exportIcon} alt="Tải" style={{ width: '14px', height: '14px' }} /></button>
            <button className={styles.actionBtn} title="Xóa" onClick={() => setDeleteConfirm(row)}><img src={deleteIcon} alt="Xóa" style={{ width: '14px', height: '14px' }} /></button>
          </>
        )}
      />

      {/* Modal xem chi tiết báo cáo */}
      {viewModal && (
        <div className={styles.modalOverlay} onClick={() => setViewModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết báo cáo</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}><span>Tên</span><strong>{viewModal.name}</strong></div>
              <div className={styles.detailItem}><span>Ngày tạo</span><strong>{viewModal.createdAt ? new Date(viewModal.createdAt).toLocaleString('vi-VN') : '—'}</strong></div>
              <div className={styles.detailItem}><span>Định dạng</span><strong>{(() => { try { return JSON.parse(viewModal.configJson).format; } catch { return '—'; } })()}</strong></div>
              <div className={styles.detailItem}><span>Nội dung</span><strong>{(() => { try { const cfg = JSON.parse(viewModal.configJson); return Object.entries(cfg.includeItems || {}).filter(([, v]) => v).map(([k]) => k).join(', '); } catch { return '—'; } })()}</strong></div>
              <div className={styles.detailItem}><span>Thời gian</span><strong>{(() => { try { const cfg = JSON.parse(viewModal.configJson); return cfg.dateFrom && cfg.dateTo ? `${cfg.dateFrom} → ${cfg.dateTo}` : 'Tất cả'; } catch { return 'Tất cả'; } })()}</strong></div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setViewModal(null)}>Đóng</button>
              <button className={styles.modalConfirm} onClick={() => { handleReDownload(viewModal); setViewModal(null); }}>Tải lại</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3><img src={alertIcon} alt="" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px' }} />Xác nhận xóa</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Bạn có chắc muốn xóa <strong>{deleteConfirm.name}</strong>?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className={styles.modalConfirm} style={{ background: 'var(--negative)' }} onClick={handleDeleteReport}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
