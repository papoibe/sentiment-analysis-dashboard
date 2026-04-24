import { useState } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './ReviewTrackingPage.module.css';

// Review Tracking — Manager
// Tham khảo: Frontend-Guide.md Trang 8
const ReviewTrackingPage = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');

  // Mock assignments data
  const assignments = [
    { id: 1, content: 'Mất vệ sinh, bẩn, chén đĩa không sạch...', assignedTo: 'Tran Thi Analyst', status: 'IN_PROGRESS', priority: 'HIGH', deadline: '2026-04-25' },
    { id: 2, content: 'Đồ ăn khó ăn, phở nhạt, thịt dai...', assignedTo: 'Le Van Analyst2', status: 'PENDING', priority: 'MEDIUM', deadline: '2026-04-28' },
    { id: 3, content: 'Phục vụ chậm, thái độ nhân viên không tốt...', assignedTo: 'Tran Thi Analyst', status: 'COMPLETED', priority: 'HIGH', deadline: '2026-04-20' },
    { id: 4, content: 'Dịch vụ tệ quá, đợi lâu mà không được phục vụ...', assignedTo: 'Le Van Analyst2', status: 'IN_PROGRESS', priority: 'LOW', deadline: '2026-04-30' },
  ];

  const filtered = assignments.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterAssignee !== 'ALL' && a.assignedTo !== filterAssignee) return false;
    return true;
  });

  const statusMap = { PENDING: 'neutral', IN_PROGRESS: 'analyst', COMPLETED: 'positive' };
  const priorityMap = { HIGH: 'negative', MEDIUM: 'neutral', LOW: 'positive' };

  const columns = [
    { key: 'content', label: 'Nội dung review', render: (val) => val.length > 45 ? val.slice(0, 45) + '...' : val },
    { key: 'assignedTo', label: 'Phân công cho' },
    { key: 'priority', label: 'Ưu tiên', render: (val) => <Badge type={priorityMap[val]}>{val}</Badge> },
    { key: 'status', label: 'Trạng thái', render: (val) => <Badge type={statusMap[val]}>{val.replace('_', ' ')}</Badge> },
    { key: 'deadline', label: 'Deadline' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Theo Dõi Xử Lý</h1>

      <div className={styles.toolbar}>
        <select className={styles.filterSelect} value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select className={styles.filterSelect} value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}>
          <option value="ALL">Tất cả assignee</option>
          <option value="Tran Thi Analyst">Tran Thi Analyst</option>
          <option value="Le Van Analyst2">Le Van Analyst2</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryRow}>
        {[
          { label: 'Pending', count: assignments.filter((a) => a.status === 'PENDING').length, color: '#F59E0B' },
          { label: 'In Progress', count: assignments.filter((a) => a.status === 'IN_PROGRESS').length, color: '#0EA5E9' },
          { label: 'Completed', count: assignments.filter((a) => a.status === 'COMPLETED').length, color: '#22C55E' },
        ].map((s) => (
          <div key={s.label} className={styles.summaryCard} style={{ borderLeftColor: s.color }}>
            <span className={styles.summaryCount}>{s.count}</span>
            <span className={styles.summaryLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};

export default ReviewTrackingPage;
