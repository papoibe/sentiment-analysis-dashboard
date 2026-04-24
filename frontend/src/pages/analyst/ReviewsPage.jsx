import { useState, useMemo } from 'react';
import DataTable from '../../components/Table/DataTable';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { mockReviews } from '../../utils/mockData';
import styles from './ReviewsPage.module.css';

// Reviews Page — Analyst
// Tham khảo: Frontend-Guide.md mục 5 Trang 4
const ReviewsPage = () => {
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('all'); // all | top_positive | top_negative
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReview, setSelectedReview] = useState(null); // Cho AI modal

  // Lọc + tìm kiếm dữ liệu
  const filteredData = useMemo(() => {
    let data = [...mockReviews];

    // Tab filter
    if (activeTab === 'top_positive') data = data.filter((r) => r.sentiment === 'POSITIVE').sort((a, b) => b.confidence - a.confidence);
    if (activeTab === 'top_negative') data = data.filter((r) => r.sentiment === 'NEGATIVE').sort((a, b) => b.confidence - a.confidence);

    // Sentiment filter
    if (sentimentFilter !== 'ALL') data = data.filter((r) => r.sentiment === sentimentFilter);

    // Search
    if (search.trim()) data = data.filter((r) => r.content.toLowerCase().includes(search.toLowerCase()));

    return data;
  }, [search, sentimentFilter, activeTab]);

  // Phân trang
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Cột bảng
  const columns = [
    { key: 'content', label: 'Nội dung', render: (val) => <span title={val}>{val.length > 60 ? val.slice(0, 60) + '...' : val}</span> },
    { key: 'sentiment', label: 'Sentiment', render: (val) => <Badge type={val.toLowerCase()}>{val}</Badge> },
    { key: 'confidence', label: 'Confidence', render: (val) => `${(val * 100).toFixed(0)}%` },
    { key: 'keywords', label: 'Keywords (AI)', render: (val) => (
      <div className={styles.keywords}>{val?.map((k, i) => <span key={i} className={styles.keyword}>{k}</span>)}</div>
    )},
    { key: 'source', label: 'Nguồn' },
    { key: 'createdAt', label: 'Ngày' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Danh Sách Reviews</h1>

      {/* Search + Filter */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="🔍 Tìm kiếm review..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <select
          className={styles.filterSelect}
          value={sentimentFilter}
          onChange={(e) => { setSentimentFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="ALL">Tất cả Sentiment</option>
          <option value="POSITIVE">Positive</option>
          <option value="NEGATIVE">Negative</option>
          <option value="NEUTRAL">Neutral</option>
        </select>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'top_positive', label: '⭐ Top Positive' },
          { key: 'top_negative', label: '⚠️ Top Negative' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={pagedData}
        actions={(row) => (
          <button
            className={styles.aiBtn}
            title="Xem chi tiết AI"
            onClick={() => setSelectedReview(row)}
          >🤖</button>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
      />

      {/* AI Detail Modal */}
      {selectedReview && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReview(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>🤖 Chi tiết AI Analysis</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedReview(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalLabel}>Nội dung review:</p>
              <p className={styles.modalContent}>{selectedReview.content}</p>
              <div className={styles.modalGrid}>
                <div>
                  <p className={styles.modalLabel}>Sentiment</p>
                  <Badge type={selectedReview.sentiment.toLowerCase()}>{selectedReview.sentiment}</Badge>
                </div>
                <div>
                  <p className={styles.modalLabel}>Confidence</p>
                  <span style={{ fontSize: '20px', fontWeight: 700 }}>{(selectedReview.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              <p className={styles.modalLabel}>Keywords</p>
              <div className={styles.keywords}>
                {selectedReview.keywords?.map((k, i) => <span key={i} className={styles.keyword}>{k}</span>)}
              </div>
              <p className={styles.modalLabel} style={{ marginTop: '12px' }}>Raw JSON Response</p>
              <pre className={styles.jsonBlock}>{JSON.stringify({
                sentiment: selectedReview.sentiment,
                confidence: selectedReview.confidence,
                keywords: selectedReview.keywords,
                explanation: 'AI analysis result from OpenAI'
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
