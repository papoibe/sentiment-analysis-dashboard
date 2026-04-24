import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// Màu tương ứng: Positive(xanh), Negative(đỏ), Neutral(vàng)
const COLORS = ['#22C55E', '#EF4444', '#F59E0B'];

// Custom label hiển thị phần trăm trên mỗi phần — Recharts PieChart
const renderLabel = ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`;

const SentimentPieChart = ({ data }) => {
  // data = [{ name: 'Positive', value: 120 }, { name: 'Negative', value: 45 }, ...]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={renderLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} reviews`, name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: '13px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentPieChart;
