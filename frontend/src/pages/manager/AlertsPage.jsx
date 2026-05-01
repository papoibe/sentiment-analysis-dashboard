import { useState, useEffect } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './AlertsPage.module.css';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../../services/alertService';

// SVG Icons từ assets/icons
import saveIcon from '../../assets/icons/save.svg';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import alertIcon from '../../assets/icons/alert.svg';

// Alerts — Manager (CRUD + API)
// Alert Rule: khi số review tiêu cực vượt ngưỡng → hệ thống cảnh báo
const AlertsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null); // null = tạo mới, object = đang sửa
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    conditionType: 'NEGATIVE_COUNT', threshold: 10, confidenceThreshold: 0.6, channel: 'IN_APP',
  });

  const [alerts, setAlerts] = useState([]);

  // Gọi API lấy alerts từ backend
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      if (res?.data && Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.warn('Backend chưa sẵn sàng:', err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({ conditionType: 'NEGATIVE_COUNT', threshold: 10, confidenceThreshold: 0.6, channel: 'IN_APP' });
    setEditingAlert(null);
    setShowForm(false);
  };

  // Tạo mới alert — POST /api/v1/alerts
  const handleSave = async () => {
    try {
      if (editingAlert) {
        // Cập nhật — PUT /api/v1/alerts/:id
        const res = await updateAlert(editingAlert.id, form);
        if (res?.data) {
          setAlerts((prev) => prev.map((a) => (a.id === editingAlert.id ? res.data : a)));
        }
      } else {
        // Tạo mới — POST /api/v1/alerts
        const res = await createAlert(form);
        if (res?.data) {
          setAlerts((prev) => [...prev, res.data]);
        }
      }
      resetForm();
    } catch (err) {
      console.error('Lưu alert lỗi:', err);
      alert('Lưu rule thất bại.');
    }
  };

  // Mở form chỉnh sửa
  const openEdit = (row) => {
    setForm({
      conditionType: row.conditionType || 'NEGATIVE_COUNT',
      threshold: row.threshold || 10,
      confidenceThreshold: row.confidenceThreshold || 0.6,
      channel: row.channel || 'IN_APP',
    });
    setEditingAlert(row);
    setShowForm(true);
  };

  // Xóa alert — DELETE /api/v1/alerts/:id
  const handleDelete = async () => {
    try {
      await deleteAlert(deleteConfirm.id);
      setAlerts((prev) => prev.filter((a) => a.id !== deleteConfirm.id));
    } catch (err) {
      console.error('Xóa alert lỗi:', err);
      alert('Xóa thất bại.');
    }
    setDeleteConfirm(null);
  };

  // Map conditionType → label dễ hiểu
  const conditionLabel = (type) => {
    const map = { NEGATIVE_COUNT: 'Negative > ngưỡng/ngày', LOW_CONFIDENCE: 'Confidence < ngưỡng', NEW_SOURCE: 'DataSource mới' };
    return map[type] || type;
  };

  const columns = [
    { key: 'conditionType', label: 'Điều kiện', render: (val) => conditionLabel(val) },
    { key: 'threshold', label: 'Ngưỡng SL' },
    { key: 'confidenceThreshold', label: 'Ngưỡng Conf.', render: (val) => val ? `${(val * 100).toFixed(0)}%` : '—' },
    { key: 'channel', label: 'Kênh', render: (val) => <Badge type={val === 'EMAIL' ? 'analyst' : 'neutral'}>{val}</Badge> },
    {
      key: 'isActive', label: 'Trạng thái',
      render: (val) => <Badge type={val !== false ? 'positive' : 'neutral'}>{val !== false ? 'ACTIVE' : 'INACTIVE'}</Badge>,
    },
    { key: 'createdAt', label: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Cảnh Báo</h1>

      <div className={styles.headerRow}>
        <p className={styles.subtitle}>Quản lý các rule cảnh báo tự động</p>
        <button className={styles.addBtn} onClick={() => { if (showForm && !editingAlert) { resetForm(); } else { resetForm(); setShowForm(true); } }}>
          {showForm ? '✕ Đóng' : '+ Tạo Rule'}
        </button>
      </div>

      {/* Create/Edit Alert Form */}
      {showForm && (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>{editingAlert ? 'Sửa Rule' : 'Tạo Rule Mới'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Điều kiện</label>
              <select className={styles.select} value={form.conditionType}
                onChange={(e) => setForm({ ...form, conditionType: e.target.value })}>
                <option value="NEGATIVE_COUNT">Negative tăng đột biến</option>
                <option value="LOW_CONFIDENCE">Confidence thấp</option>
                <option value="NEW_SOURCE">DataSource mới được thêm</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ngưỡng số lượng</label>
              <input className={styles.input} type="number" value={form.threshold}
                onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} />
            </div>
            <div className={styles.formGroup}>
              <label>Ngưỡng confidence (0-1)</label>
              <input className={styles.input} type="number" step="0.1" min="0" max="1" value={form.confidenceThreshold}
                onChange={(e) => setForm({ ...form, confidenceThreshold: Number(e.target.value) })} />
            </div>
            <div className={styles.formGroup}>
              <label>Kênh thông báo</label>
              <select className={styles.select} value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                <option value="IN_APP">In-App</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={resetForm}>Hủy</button>
            <button className={styles.saveBtn} onClick={handleSave}>
              <img src={saveIcon} alt="" style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '4px' }} />
              {editingAlert ? 'Cập nhật' : 'Lưu Rule'}
            </button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={alerts}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Sửa" onClick={() => openEdit(row)}>
              <img src={editIcon} alt="Sửa" style={{ width: '14px', height: '14px' }} />
            </button>
            <button className={styles.actionBtn} title="Xóa" onClick={() => setDeleteConfirm(row)}>
              <img src={deleteIcon} alt="Xóa" style={{ width: '14px', height: '14px' }} />
            </button>
          </>
        )}
      />

      {/* Modal xác nhận xóa */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3><img src={alertIcon} alt="" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px' }} />Xác nhận xóa</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Bạn có chắc muốn xóa rule <strong>{conditionLabel(deleteConfirm.conditionType)}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className={styles.deleteBtn} onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
