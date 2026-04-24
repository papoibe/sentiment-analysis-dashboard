import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { mockUsers } from '../../utils/mockData';
import styles from './UserManagementPage.module.css';

// User Management — Admin
// Tham khảo: Frontend-Guide.md mục 5 Trang 10
const UserManagementPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null); // user cần xóa

  const filtered = search.trim()
    ? users.filter((u) => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()))
    : users;

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Vai trò', render: (val) => <Badge type={val.toLowerCase()}>{val}</Badge> },
    { key: 'createdAt', label: 'Ngày tạo' },
  ];

  const handleDelete = (user) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setDeleteModal(null);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Quản Lý Người Dùng</h1>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="🔍 Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <a href="/users/create" className={styles.addBtn}>+ Tạo mới</a>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem">👁</button>
            <button className={styles.actionBtn} title="Sửa">✏️</button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Xóa" onClick={() => setDeleteModal(row)}>🗑</button>
          </>
        )}
      />

      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />

      {/* Confirm Delete Modal */}
      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Xác nhận xóa</h3>
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
