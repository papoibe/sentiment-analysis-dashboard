import StatCard from '../../components/Cards/StatCard';
import SentimentPieChart from '../../components/Charts/SentimentPieChart';
import SourceBarChart from '../../components/Charts/SourceBarChart';
import TrendLineChart from '../../components/Charts/TrendLineChart';
import { mockDashboard } from '../../utils/mockData';
import styles from './DashboardPage.module.css';

// SVG Icons
import dashboardIcon from '../../assets/icons/dashboard.svg';
import positiveIcon from '../../assets/icons/positive.svg';
import negativeIcon from '../../assets/icons/negative.svg';
import neutralIcon from '../../assets/icons/neutral.svg';

// Dashboard Page — Analyst
// Tham khảo: Frontend-Guide.md mục 5 Trang 3
// Gồm: 4 Stat Cards + Pie Chart + Bar Chart + Trend Line Chart
const DashboardPage = () => {
  // TODO: Thay mockDashboard bằng API call khi backend sẵn sàng
  // useEffect(() => { getDashboardSummary().then(setData) }, []);
  const data = mockDashboard;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* 4 Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={dashboardIcon}
          label="Tổng Reviews"
          value={data.totalReviews.toLocaleString()}
          color="#0EA5E9"
          trend={12}
        />
        <StatCard
          icon={neutralIcon}
          label="Confidence TB"
          value={`${data.avgConfidence}%`}
          color="#D4A843"
          trend={3.5}
        />
        <StatCard
          icon={positiveIcon}
          label="Tích cực"
          value={data.positiveCount.toLocaleString()}
          color="#22C55E"
          trend={8}
        />
        <StatCard
          icon={negativeIcon}
          label="Tiêu cực"
          value={data.negativeCount.toLocaleString()}
          color="#EF4444"
          trend={-5}
        />
      </div>

      {/* Row 2: Pie Chart + Bar Chart */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Tỷ lệ Sentiment</h2>
          <SentimentPieChart data={data.sentimentDistribution} />
        </div>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Thống kê theo Data Source</h2>
          <SourceBarChart data={data.sentimentBySource} />
        </div>
      </div>

      {/* Row 3: Trend Line Chart */}
      <div className={styles.chartCard} style={{ marginTop: '20px' }}>
        <h2 className={styles.chartTitle}>Xu hướng Sentiment theo thời gian</h2>
        <TrendLineChart
          data7d={data.trend7d}
          data30d={data.trend30d}
          data90d={data.trend90d}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
