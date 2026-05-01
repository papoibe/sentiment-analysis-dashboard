import { useState, useEffect } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { mockUsers } from '../../utils/mockData';
import styles from './UserManagementPage.module.css';

// SVG Icons
import viewIcon from '../../assets/icons/view.svg';
import editIcon from '../../assets/icons/edit.svg';
import deleteIcon from '../../assets/icons/delete.svg';
import alertIcon from '../../assets/icons/alert.svg';

// User Management — Admin (CRUD đầy đủ)
const UserManagementPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [formModal, setFormModal] = useState(null); // { mode: 'create'|'edit'|'view', user: {...} }
  const [formData, setFormData] = useState({ username: '', email: '', fullName: '', role: 'ANALYST', password: '' });
  const [loading, setLoading] = useState(false);

  // Gọi API lấy danh sách users
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res?.data && Array.isArray(res.data)) setUsers(res.data);
    } catch (err) {
      console.warn('Backend chưa sẵn sàng, dùng mockData:', err.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = search.trim()
    ? users.filter((u) => u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase()))
    : users;

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Vai trò', render: (val) => <Badge type={val?.toLowerCase()}>{val}</Badge> },
    { key: 'createdAt', label: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '' },
  ];

  // Mở modal tạo mới
  const openCreate = () => {
    setFormData({ username: '', email: '', fullName: '', role: 'ANALYST', password: '' });
    setFormModal({ mode: 'create', user: null });
  };

  // Mở modal xem chi tiết
  const openView = (user) => {
    setFormData({ ...user, password: '' });
    setFormModal({ mode: 'view', user });
  };

  // Mở modal sửa
  const openEdit = (user) => {
    setFormData({ ...user, password: '' });
    setFormModal({ mode: 'edit', user });
  };

  // Submit tạo/sửa
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (formModal.mode === 'create') {
        // Gọi API tạo user mới
        const res = await createUser(formData);
        if (res?.data) {
          setUsers((prev) => [...prev, res.data]);
        } else {
          // Fallback: thêm vào state local
          const newUser = { ...formData, id: Date.now(), createdAt: new Date().toISOString() };
          setUsers((prev) => [...prev, newUser]);
        }
      } else if (formModal.mode === 'edit') {
        // Gọi API cập nhật user
        const res = await updateUser(formModal.user.id, formData);
        if (res?.data) {
          setUsers((prev) => prev.map((u) => (u.id === formModal.user.id ? res.data : u)));
        } else {
          setUsers((prev) => prev.map((u) => (u.id === formModal.user.id ? { ...u, ...formData } : u)));
        }
      }
    } catch (err) {
      console.warn('API lỗi, cập nhật local:', err.message);
      if (formModal.mode === 'create') {
        const newUser = { ...formData, id: Date.now(), createdAt: new Date().toISOString() };
        setUsers((prev) => [...prev, newUser]);
      } else {
        setUsers((prev) => prev.map((u) => (u.id === formModal.user.id ? { ...u, ...formData } : u)));
      }
    }
    setLoading(false);
    setFormModal(null);
  };

  // Xóa user
  const handleDelete = async (user) => {
    try {
      await deleteUser(user.id);
    } catch (err) {
      console.warn('API xóa lỗi, xóa local:', err.message);
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setDeleteModal(null);
  };

  // Tiêu đề modal theo mode
  const modalTitle = formModal?.mode === 'create' ? 'Tạo Người Dùng Mới' : formModal?.mode === 'edit' ? 'Chỉnh Sửa Người Dùng' : 'Chi Tiết Người Dùng';
  const isReadOnly = formModal?.mode === 'view';

  return (
    <div>
      <h1 className={styles.pageTitle}>Quản Lý Người Dùng</h1>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.addBtn} onClick={openCreate}>+ Tạo mới</button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem" onClick={() => openView(row)}><img src={viewIcon} alt="Xem" style={{width:'14px',height:'14px'}} /></button>
            <button className={styles.actionBtn} title="Sửa" onClick={() => openEdit(row)}><img src={editIcon} alt="Sửa" style={{width:'14px',height:'14px'}} /></button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Xóa" onClick={() => setDeleteModal(row)}><img src={deleteIcon} alt="Xóa" style={{width:'14px',height:'14px'}} /></button>
          </>
        )}
      />

      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />

      {/* Form Modal — Create / Edit / View */}
      {formModal && (
        <div className={styles.modalOverlay} onClick={() => setFormModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{width: '480px'}}>
            <h3>{modalTitle}</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input className={styles.formInput} value={formData.username || ''} readOnly={isReadOnly || formModal.mode === 'edit'}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Họ và tên</label>
                <input className={styles.formInput} value={formData.fullName || ''} readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input className={styles.formInput} type="email" value={formData.email || ''} readOnly={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Vai trò</label>
                <select className={styles.formInput} value={formData.role || 'ANALYST'} disabled={isReadOnly}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="ANALYST">ANALYST</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {formModal.mode === 'create' && (
                <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
                  <label>Mật khẩu</label>
                  <input className={styles.formInput} type="password" value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setFormModal(null)}>{isReadOnly ? 'Đóng' : 'Hủy'}</button>
              {!isReadOnly && (
                <button className={styles.confirmDeleteBtn} style={{background: 'var(--primary)'}} onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Đang xử lý...' : formModal.mode === 'create' ? 'Tạo' : 'Lưu'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3><img src={alertIcon} alt="" style={{width:'18px',height:'18px',verticalAlign:'middle',marginRight:'6px'}} />Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa user <strong>{deleteModal.fullName}</strong> ({deleteModal.username})?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteModal(null)}>Hủy</button>
              <button className={styles.confirmDeleteBtn} onClick={() => handleDelete(deleteModal)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
