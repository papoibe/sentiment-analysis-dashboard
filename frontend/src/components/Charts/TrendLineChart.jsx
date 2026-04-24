import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Tabs period: 7d / 30d / 90d — Recharts LineChart
const TrendLineChart = ({ data7d, data30d, data90d }) => {
  const [period, setPeriod] = useState('30d'); // Mặc định xem 30 ngày

  // Chọn data theo period hiện tại
  const dataMap = { '7d': data7d, '30d': data30d, '90d': data90d };
  const currentData = dataMap[period] || data30d;

  return (
    <div>
      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['7d', '30d', '90d'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: period === p ? 'none' : '1px solid #E5E7EB',
              background: period === p ? '#D4A843' : 'white',
              color: period === p ? 'white' : '#6B7280',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {p === '7d' ? '7 ngày' : p === '30d' ? '30 ngày' : '90 ngày'}
          </button>
        ))}
      </div>

      {/* Line chart — 3 đường: Positive, Negative, Neutral */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={currentData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
          <Line type="monotone" dataKey="positive" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} name="Positive" />
          <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Negative" />
          <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Neutral" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;
