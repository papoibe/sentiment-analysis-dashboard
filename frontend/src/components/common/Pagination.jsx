import styles from './Pagination.module.css';

// Pagination — phân trang giống Kolytics (1 2 3 4 5 ▶ + 20/trang)
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize = 20, onPageSizeChange }) => {
  // Tính danh sách page numbers hiển thị (tối đa 5 nút)
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.pages}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >◀</button>

        {getPages().map((p) => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
          >{p}</button>
        ))}

        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >▶</button>
      </div>

      {onPageSizeChange && (
        <select
          className={styles.sizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10/trang</option>
          <option value={20}>20/trang</option>
          <option value={50}>50/trang</option>
        </select>
      )}
    </div>
  );
};

export default Pagination;
