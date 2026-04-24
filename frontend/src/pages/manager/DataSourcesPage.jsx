import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import { mockDataSources } from '../../utils/mockData';
import styles from './DataSourcesPage.module.css';

// Data Sources — Manager
// Tham khảo: Frontend-Guide.md mục 5 Trang 6
const DataSourcesPage = () => {
  const [sources, setSources] = useState(mockDataSources);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = search.trim()
    ? sources.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : sources;

  const columns = [
    { key: 'name', label: 'Tên nguồn' },
    { key: 'type', label: 'Loại', render: (val) => <Badge type={val === 'CSV' ? 'neutral' : 'analyst'}>{val}</Badge> },
    { key: 'description', label: 'Mô tả', render: (val) => <span title={val}>{val?.length > 40 ? val.slice(0, 40) + '...' : val}</span> },
    { key: 'reviewCount', label: 'Reviews', render: (val) => val?.toLocaleString() },
    { key: 'status', label: 'Trạng thái', render: (val) => <Badge type={val === 'ACTIVE' ? 'positive' : 'negative'}>{val}</Badge> },
    { key: 'createdAt', label: 'Ngày tạo' },
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
        <button className={styles.addBtn}>+ Tạo mới</button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button className={styles.actionBtn} title="Xem">👁</button>
            <button className={styles.actionBtn} title="Sửa">✏️</button>
            <button className={styles.actionBtn} title="Xóa">🗑</button>
          </>
        )}
      />
    </div>
  );
};

export default DataSourcesPage;
