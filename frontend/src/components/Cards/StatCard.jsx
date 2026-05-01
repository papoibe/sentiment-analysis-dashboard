import styles from './StatCard.module.css';

// StatCard — Card thống kê (giống Kolytics)
// Props: icon (string path SVG hoặc emoji fallback), label, value, color, trend
const StatCard = ({ icon, label, value, color = 'var(--primary)', trend }) => {
  // Kiểm tra icon là SVG path hay emoji — Vite import SVG có thể trả URL dạng /src/...svg?import hoặc data:image/svg+xml
  const isSvg = typeof icon === 'string' && (icon.includes('.svg') || icon.startsWith('data:image'));

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ background: color + '15', color }}>
        {isSvg ? (
          <img src={icon} alt={label} className={styles.iconSvg} />
        ) : (
          <span className={styles.icon}>{icon}</span>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span className={`${styles.trend} ${trend > 0 ? styles.up : styles.down}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
