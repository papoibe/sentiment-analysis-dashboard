import { useState, useEffect } from 'react';
import StatCard from '../../components/Cards/StatCard';
import SentimentPieChart from '../../components/Charts/SentimentPieChart';
import SourceBarChart from '../../components/Charts/SourceBarChart';
import TrendLineChart from '../../components/Charts/TrendLineChart';
import { getDashboardSummary, getDashboardTrend } from '../../services/dashboardService';
import { mockDashboard } from '../../utils/mockData';
import styles from './DashboardPage.module.css';

// SVG Icons
import dashboardIcon from '../../assets/icons/dashboard.svg';
import positiveIcon from '../../assets/icons/positive.svg';
import negativeIcon from '../../assets/icons/negative.svg';
import neutralIcon from '../../assets/icons/neutral.svg';

// Dashboard Page — Analyst
// Gồm: 4 Stat Cards + Pie Chart + Bar Chart + Trend Line Chart
const DashboardPage = () => {
  const [data, setData] = useState(mockDashboard); // Fallback dùng mockData
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dashboard summary từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await getDashboardSummary();
        // Backend trả ApiResponse { data: DashboardSummaryResponse }
        // Map API fields sang format frontend cần (giữ mock fields làm fallback)
        if (summaryRes?.data) {
          const api = summaryRes.data;
          setData((prev) => ({
            ...prev, // Giữ chart data từ mock nếu API không có
            totalReviews: api.totalReviews ?? prev.totalReviews,
            positiveCount: api.positiveCount ?? prev.positiveCount,
            negativeCount: api.negativeCount ?? prev.negativeCount,
            neutralCount: api.neutralCount ?? prev.neutralCount,
            avgConfidence: api.avgConfidenceScore ?? api.avgConfidence ?? prev.avgConfidence,
            // Tạo sentimentDistribution từ API data nếu có đủ
            sentimentDistribution: [
              { label: 'Tích cực', value: api.positiveCount ?? prev.positiveCount, color: '#22C55E' },
              { label: 'Tiêu cực', value: api.negativeCount ?? prev.negativeCount, color: '#EF4444' },
              { label: 'Trung lập', value: api.neutralCount ?? prev.neutralCount, color: '#F59E0B' },
            ],
          }));
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng, dùng mockData:', err.message);
        // Giữ nguyên mockData làm fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Null-safe access — tránh crash khi data chưa có field
  const totalReviews = data?.totalReviews ?? 0;
  const avgConfidence = data?.avgConfidence ?? 0;
  const positiveCount = data?.positiveCount ?? 0;
  const negativeCount = data?.negativeCount ?? 0;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* 4 Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={dashboardIcon}
          label="Tổng Reviews"
          value={totalReviews.toLocaleString()}
          color="#0EA5E9"
          trend={12}
        />
        <StatCard
          icon={neutralIcon}
          label="Confidence TB"
          value={`${avgConfidence}%`}
          color="#D4A843"
          trend={3.5}
        />
        <StatCard
          icon={positiveIcon}
          label="Tích cực"
          value={positiveCount.toLocaleString()}
          color="#22C55E"
          trend={8}
        />
        <StatCard
          icon={negativeIcon}
          label="Tiêu cực"
          value={negativeCount.toLocaleString()}
          color="#EF4444"
          trend={-5}
        />
      </div>

      {/* Row 2: Pie Chart + Bar Chart */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Tỷ lệ Sentiment</h2>
          {data?.sentimentDistribution && <SentimentPieChart data={data.sentimentDistribution} />}
        </div>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Thống kê theo Data Source</h2>
          {data?.sentimentBySource && <SourceBarChart data={data.sentimentBySource} />}
        </div>
      </div>

      {/* Row 3: Trend Line Chart */}
      <div className={styles.chartCard} style={{ marginTop: '20px' }}>
        <h2 className={styles.chartTitle}>Xu hướng Sentiment theo thời gian</h2>
        {data?.trend7d && (
          <TrendLineChart
            data7d={data.trend7d}
            data30d={data.trend30d}
            data90d={data.trend90d}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
