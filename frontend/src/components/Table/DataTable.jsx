import styles from './DataTable.module.css';

// DataTable — Bảng dữ liệu dùng chung cho tất cả trang
// Props: columns (mảng {key, label, render?}), data (mảng objects), actions (render hành động)
const DataTable = ({ columns, data, actions }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thAction}>STT</th>
            {actions && <th className={styles.thAction}>Hành động</th>}
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 2 : 1)} className={styles.empty}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className={styles.row}>
                <td className={styles.stt}>{idx + 1}</td>
                {actions && <td className={styles.actions}>{actions(row)}</td>}
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
