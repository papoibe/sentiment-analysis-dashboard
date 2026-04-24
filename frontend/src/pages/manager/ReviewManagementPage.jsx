import { useState, useMemo } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { mockReviews } from '../../utils/mockData';
import styles from './ReviewManagementPage.module.css';

// SVG Icons
import flagIcon from '../../assets/icons/flag.svg';
import assignIcon from '../../assets/icons/assign.svg';

// Review Management — Manager (Flag + Assign)
// Tham khảo: Frontend-Guide.md Trang 7
const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [flagModal, setFlagModal] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [flagPriority, setFlagPriority] = useState('MEDIUM');
  const [flagNote, setFlagNote] = useState('');
  const [assignUser, setAssignUser] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...reviews];
    if (statusFilter !== 'ALL') data = data.filter((r) => r.status === statusFilter);
    if (search.trim()) data = data.filter((r) => r.content.toLowerCase().includes(search.toLowerCase()));
    return data;
  }, [reviews, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / 10);
  const pagedData = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  // Xử lý Flag review
  const handleFlag = () => {
    setReviews((prev) => prev.map((r) =>
      r.id === flagModal.id ? { ...r, status: 'FLAGGED', priority: flagPriority } : r
    ));
    setFlagModal(null);
    setFlagNote('');
    setFlagPriority('MEDIUM');
  };

  // Xử lý Assign review cho analyst
  const handleAssign = () => {
    setReviews((prev) => prev.map((r) =>
      r.id === assignModal.id ? { ...r, status: 'ASSIGNED', assignedTo: assignUser } : r
    ));
    setAssignModal(null);
    setAssignUser('');
  };

  const statusBadge = (status) => {
    const map = { ANALYZED: 'positive', FLAGGED: 'negative', ASSIGNED: 'analyst' };
    return <Badge type={map[status] || 'neutral'}>{status}</Badge>;
  };

  const columns = [
    { key: 'content', label: 'Nội dung', render: (val) => <span title={val}>{val.length > 50 ? val.slice(0, 50) + '...' : val}</span> },
    { key: 'sentiment', label: 'Sentiment', render: (val) => <Badge type={val.toLowerCase()}>{val}</Badge> },
    { key: 'confidence', label: 'Conf.', render: (val) => `${(val * 100).toFixed(0)}%` },
    { key: 'status', label: 'Trạng thái', render: (val) => statusBadge(val) },
    { key: 'source', label: 'Nguồn' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Quản Lý Reviews</h1>

      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Tìm kiếm..." value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        <select className={styles.filterSelect} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ANALYZED">Analyzed</option>
          <option value="FLAGGED">Flagged</option>
          <option value="ASSIGNED">Assigned</option>
        </select>
      </div>

      <DataTable columns={columns} data={pagedData}
        actions={(row) => (
          <>
            <button className={styles.flagBtn} title="Flag review" onClick={() => setFlagModal(row)}><img src={flagIcon} alt="Flag" style={{width:'16px',height:'16px'}} /></button>
            <button className={styles.assignBtn} title="Assign cho analyst" onClick={() => setAssignModal(row)}><img src={assignIcon} alt="Assign" style={{width:'16px',height:'16px'}} /></button>
          </>
        )}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Flag Modal */}
      {flagModal && (
        <div className={styles.modalOverlay} onClick={() => setFlagModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3><img src={flagIcon} alt="" style={{width:'18px',height:'18px',verticalAlign:'middle',marginRight:'6px'}} />Flag Review</h3>
            <p className={styles.modalContent}>"{flagModal.content.slice(0, 80)}..."</p>
            <div className={styles.formGroup}>
              <label>Priority</label>
              <select className={styles.select} value={flagPriority} onChange={(e) => setFlagPriority(e.target.value)}>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ghi chú</label>
              <textarea className={styles.textarea} rows={3} value={flagNote}
                onChange={(e) => setFlagNote(e.target.value)} placeholder="Lý do flag..." />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setFlagModal(null)}>Hủy</button>
              <button className={styles.confirmBtn} onClick={handleFlag}>Flag</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className={styles.modalOverlay} onClick={() => setAssignModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3><img src={assignIcon} alt="" style={{width:'18px',height:'18px',verticalAlign:'middle',marginRight:'6px'}} />Assign Review</h3>
            <p className={styles.modalContent}>"{assignModal.content.slice(0, 80)}..."</p>
            <div className={styles.formGroup}>
              <label>Chọn Analyst</label>
              <select className={styles.select} value={assignUser} onChange={(e) => setAssignUser(e.target.value)}>
                <option value="">-- Chọn user --</option>
                <option value="analyst">Tran Thi Analyst</option>
                <option value="analyst2">Le Van Analyst2</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setAssignModal(null)}>Hủy</button>
              <button className={styles.confirmBtn} disabled={!assignUser} onClick={handleAssign}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagementPage;
