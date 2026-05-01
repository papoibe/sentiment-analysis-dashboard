import { useState, useEffect } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import styles from './ReviewTrackingPage.module.css';
import { getAssignments } from '../../services/reviewService';

// Review Tracking — Manager
// Theo dõi review đã assign: PENDING → IN_PROGRESS → COMPLETED
const ReviewTrackingPage = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');

  const [assignments, setAssignments] = useState([]);
  const [assignees, setAssignees] = useState([]); // Danh sách assignees unique

  // Gọi API lấy assignments — GET /api/v1/reviews/assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await getAssignments();
        // Backend trả { data: { content: [...], total_elements } }
        let data = [];
        if (res?.data?.content && Array.isArray(res.data.content)) {
          data = res.data.content;
        } else if (res?.data && Array.isArray(res.data)) {
          data = res.data;
        }

        // Map assignment fields cho DataTable
        const mapped = data.map((a) => ({
          id: a.id,
          content: a.review?.content || a.content || '—',
          assignedTo: a.assignedTo?.fullName || a.assignedTo || '—',
          assignedToId: a.assignedTo?.id || null,
          status: a.status || 'PENDING',
          priority: a.review?.priority || a.priority || 'MEDIUM',
          deadline: a.deadline || '—',
        }));

        setAssignments(mapped);

        // Extract unique assignees cho filter dropdown
        const uniqueAssignees = [...new Set(mapped.map((a) => a.assignedTo).filter(Boolean))];
        setAssignees(uniqueAssignees);
      } catch (err) {
        console.warn('Backend chưa sẵn sàng:', err.message);
        // Mock data khi API lỗi
        setAssignments([]);
      }
    };
    fetchAssignments();
  }, []);

  const filtered = assignments.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterAssignee !== 'ALL' && a.assignedTo !== filterAssignee) return false;
    return true;
  });

  const statusMap = { PENDING: 'neutral', IN_PROGRESS: 'analyst', COMPLETED: 'positive' };
  const priorityMap = { HIGH: 'negative', MEDIUM: 'neutral', LOW: 'positive' };

  const columns = [
    { key: 'content', label: 'Nội dung review', render: (val) => val?.length > 45 ? val.slice(0, 45) + '...' : val },
    { key: 'assignedTo', label: 'Phân công cho' },
    { key: 'priority', label: 'Ưu tiên', render: (val) => <Badge type={priorityMap[val] || 'neutral'}>{val}</Badge> },
    { key: 'status', label: 'Trạng thái', render: (val) => <Badge type={statusMap[val] || 'neutral'}>{val?.replace('_', ' ')}</Badge> },
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
          {assignees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
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

      {assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p>Chưa có review nào được assign.</p>
          <p style={{ fontSize: '13px' }}>Vào trang <strong>Quản lý Review</strong> → bấm nút Assign để phân công.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
};

export default ReviewTrackingPage;
