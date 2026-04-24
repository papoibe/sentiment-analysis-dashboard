import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Màu cho từng bar — mỗi data source 1 màu riêng
const BAR_COLORS = ['#D4A843', '#0EA5E9', '#8B5CF6', '#EF4444', '#22C55E'];

const SourceBarChart = ({ data }) => {
  // data = [{ source: 'Google', count: 520 }, { source: 'Facebook', count: 380 }, ...]
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis
          dataKey="source"
          type="category"
          tick={{ fontSize: 13, fill: '#1A1A1A' }}
          width={90}
        />
        <Tooltip
          formatter={(value) => [`${value} reviews`]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
          {data.map((entry, index) => (
            <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default SourceBarChart;
