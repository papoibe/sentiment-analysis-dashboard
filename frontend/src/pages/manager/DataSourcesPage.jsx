import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import { getDataSources, createDataSource, updateDataSource, deleteDataSource } from '../../services/dataSourceService';
import styles from './DataSourcesPage.module.css';

// SVG Icons
import viewIcon from '../../assets/icons/view.svg';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import alertIcon from '../../assets/icons/alert.svg';

// Data Sources — Manager (Full CRUD + API)
const DataSourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state cho Create/Edit
  const [form, setForm] = useState({ name: '', type: 'CSV', description: '' });

  // Gọi API lấy danh sách datasources từ backend
  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await getDataSources();
      // API trả ApiResponse { data: [...] }
      if (res?.data && Array.isArray(res.data)) {
        setSources(res.data);
      }
    } catch (err) {
      console.error('Lỗi lấy datasources:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = search.trim()
    ? sources.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : sources;

  // Tạo mới datasource — gọi POST /api/v1/data-sources
  const handleCreate = async () => {
    try {
      const res = await createDataSource(form);
      if (res?.data) {
        setSources((prev) => [...prev, res.data]);
      }
      setCreateModal(false);
      setForm({ name: '', type: 'CSV', description: '' });
    } catch (err) {
      console.error('Tạo datasource lỗi:', err);
      alert('Tạo nguồn dữ liệu thất bại.');
    }
  };

  // Sửa datasource — gọi PUT /api/v1/data-sources/:id
  const handleEdit = async () => {
    try {
      const res = await updateDataSource(editModal.id, form);
      if (res?.data) {
        setSources((prev) => prev.map((s) => (s.id === editModal.id ? res.data : s)));
      }
      setEditModal(null);
      setForm({ name: '', type: 'CSV', description: '' });
    } catch (err) {
      console.error('Sửa datasource lỗi:', err);
      alert('Cập nhật thất bại.');
    }
  };

  // Xóa datasource — gọi DELETE /api/v1/data-sources/:id (soft delete)
  const handleDelete = async () => {
    try {
      await deleteDataSource(deleteConfirm.id);
      setSources((prev) => prev.filter((s) => s.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Xóa datasource lỗi:', err);
      alert('Xóa thất bại.');
    }
  };

  // Mở Edit modal — fill form với data hiện tại
  const openEdit = (row) => {
    setForm({ name: row.name, type: row.type, description: row.description || '' });
    setEditModal(row);
  };

  const columns = [
    { key: 'name', label: 'Tên nguồn' },
    { key: 'type', label: 'Loại', render: (val) => <Badge type={val === 'CSV' ? 'neutral' : 'analyst'}>{val}</Badge> },
    { key: 'description', label: 'Mô tả', render: (val) => <span title={val}>{val?.length > 40 ? val.slice(0, 40) + '...' : val}</span> },
    {
      key: 'isActive', label: 'Trạng thái',
      render: (val) => <Badge type={val !== false ? 'positive' : 'negative'}>{val !== false ? 'ACTIVE' : 'INACTIVE'}</Badge>,
    },
    { key: 'createdAt', label: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Nguồn Dữ Liệu</h1>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="🔍 Tìm kiếm nguồn dữ liệu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.importBtn} onClick={() => navigate('/data-sources/import')}>📥 Import CSV</button>
        <button className={styles.addBtn} onClick={() => { setForm({ name: '', type: 'CSV', description: '' }); setCreateModal(true); }}>+ Tạo mới</button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem" onClick={() => setViewModal(row)}>
              <img src={viewIcon} alt="Xem" style={{ width: '14px', height: '14px' }} />
            </button>
            <button className={styles.actionBtn} title="Sửa" onClick={() => openEdit(row)}>
              <img src={editIcon} alt="Sửa" style={{ width: '14px', height: '14px' }} />
            </button>
            <button className={styles.actionBtn} title="Xóa" onClick={() => setDeleteConfirm(row)}>
              <img src={deleteIcon} alt="Xóa" style={{ width: '14px', height: '14px' }} />
            </button>
          </>
        )}
      />

      {/* Modal Tạo mới */}
      {createModal && (
        <div className={styles.modalOverlay} onClick={() => setCreateModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Tạo nguồn dữ liệu mới</h3>
            <div className={styles.modalForm}>
              <div className={styles.modalField}>
                <label>Tên nguồn</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Google Reviews - Nhà hàng ABC" />
              </div>
              <div className={styles.modalField}>
                <label>Loại</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="CSV">CSV</option>
                  <option value="API">API</option>
                  <option value="EXCEL">EXCEL</option>
                  <option value="GOOGLE">GOOGLE</option>
                  <option value="FACEBOOK">FACEBOOK</option>
                </select>
              </div>
              <div className={styles.modalField}>
                <label>Mô tả</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả chi tiết..." />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setCreateModal(false)}>Hủy</button>
              <button className={styles.modalConfirm} disabled={!form.name.trim()} onClick={handleCreate}>Tạo</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {viewModal && (
        <div className={styles.modalOverlay} onClick={() => setViewModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết nguồn dữ liệu</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}><span>ID</span><strong>{viewModal.id}</strong></div>
              <div className={styles.detailItem}><span>Tên</span><strong>{viewModal.name}</strong></div>
              <div className={styles.detailItem}><span>Loại</span><strong>{viewModal.type}</strong></div>
              <div className={styles.detailItem}><span>Mô tả</span><strong>{viewModal.description || '—'}</strong></div>
              <div className={styles.detailItem}><span>Trạng thái</span><strong>{viewModal.isActive !== false ? 'ACTIVE' : 'INACTIVE'}</strong></div>
              <div className={styles.detailItem}><span>Ngày tạo</span><strong>{viewModal.createdAt ? new Date(viewModal.createdAt).toLocaleString('vi-VN') : '—'}</strong></div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setViewModal(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa */}
      {editModal && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Sửa nguồn dữ liệu</h3>
            <div className={styles.modalForm}>
              <div className={styles.modalField}>
                <label>Tên nguồn</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.modalField}>
                <label>Loại</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="CSV">CSV</option>
                  <option value="API">API</option>
                  <option value="EXCEL">EXCEL</option>
                  <option value="GOOGLE">GOOGLE</option>
                  <option value="FACEBOOK">FACEBOOK</option>
                </select>
              </div>
              <div className={styles.modalField}>
                <label>Mô tả</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setEditModal(null)}>Hủy</button>
              <button className={styles.modalConfirm} onClick={handleEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3><img src={alertIcon} alt="" style={{ width: '18px', height: '18px', verticalAlign: 'middle', marginRight: '6px' }} />Xác nhận xóa</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Bạn có chắc muốn xóa <strong>{deleteConfirm.name}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className={styles.modalConfirm} style={{ background: 'var(--negative)' }} onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourcesPage;
