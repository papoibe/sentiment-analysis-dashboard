import styles from './Badge.module.css';

// Badge component — hiển thị sentiment/role với màu sắc
// type: 'positive'|'negative'|'neutral'|'admin'|'manager'|'analyst'
const Badge = ({ type, children }) => {
  return (
    <span className={`${styles.badge} ${styles[type] || ''}`}>
      {children}
    </span>
  );
};

export default Badge;
