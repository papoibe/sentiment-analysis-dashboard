// Mock data cho Dashboard — dùng tạm khi chưa kết nối backend
// Sẽ bỏ khi tích hợp API thật

// Hàm tạo trend data ngẫu nhiên cho N ngày
const generateTrendData = (days) => {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      positive: Math.floor(Math.random() * 30) + 15,
      negative: Math.floor(Math.random() * 15) + 3,
      neutral: Math.floor(Math.random() * 10) + 2,
    });
  }
  return data;
};

export const mockDashboard = {
  totalReviews: 1247,
  avgConfidence: 85.2,
  positiveCount: 812,
  negativeCount: 310,
  neutralCount: 125,

  sentimentDistribution: [
    { name: 'Positive', value: 812 },
    { name: 'Negative', value: 310 },
    { name: 'Neutral', value: 125 },
  ],

  sentimentBySource: [
    { source: 'Google', count: 520 },
    { source: 'Facebook', count: 380 },
    { source: 'CSV Import', count: 250 },
    { source: 'Shopee', count: 97 },
  ],

  trend7d: generateTrendData(7),
  trend30d: generateTrendData(30),
  trend90d: generateTrendData(90),
};

// === SPRINT 3: Mock Reviews ===
export const mockReviews = [
  { id: 1, content: 'Phở rất ngon, nước dùng đậm đà, thịt bò tươi. Sẽ quay lại!', sentiment: 'POSITIVE', confidence: 0.92, keywords: ['phở', 'ngon', 'đậm đà'], source: 'Google', createdAt: '2026-03-12', status: 'ANALYZED' },
  { id: 2, content: 'Dịch vụ tệ quá, đợi lâu mà không được phục vụ. Thất vọng!', sentiment: 'NEGATIVE', confidence: 0.88, keywords: ['dịch vụ', 'tệ', 'đợi lâu'], source: 'Google', createdAt: '2026-03-11', status: 'FLAGGED' },
  { id: 3, content: 'Giá hợp lý cho chất lượng như vậy, nhân viên thân thiện', sentiment: 'POSITIVE', confidence: 0.78, keywords: ['giá', 'hợp lý', 'thân thiện'], source: 'Facebook', createdAt: '2026-03-10', status: 'ANALYZED' },
  { id: 4, content: 'Không gian sạch sẽ nhưng món ăn bình thường, không có gì nổi bật', sentiment: 'NEUTRAL', confidence: 0.55, keywords: ['sạch sẽ', 'bình thường'], source: 'CSV', createdAt: '2026-03-09', status: 'ANALYZED' },
  { id: 5, content: 'Cafe ngon, giá rẻ, nhân viên nhanh nhẹn và chuyên nghiệp', sentiment: 'POSITIVE', confidence: 0.95, keywords: ['cafe', 'ngon', 'rẻ', 'nhanh'], source: 'Facebook', createdAt: '2026-03-08', status: 'ANALYZED' },
  { id: 6, content: 'Đồ ăn khó ăn, phở nhạt, thịt dai. Không bao giờ quay lại', sentiment: 'NEGATIVE', confidence: 0.91, keywords: ['khó ăn', 'nhạt', 'dai'], source: 'Google', createdAt: '2026-03-07', status: 'ANALYZED' },
  { id: 7, content: 'Quán đẹp, đồ uống ngon, giá hơi đắt nhưng chấp nhận được', sentiment: 'POSITIVE', confidence: 0.72, keywords: ['đẹp', 'ngon', 'đắt'], source: 'Shopee', createdAt: '2026-03-06', status: 'ASSIGNED' },
  { id: 8, content: 'Phục vụ chậm, thái độ nhân viên không tốt. Cần cải thiện nhiều', sentiment: 'NEGATIVE', confidence: 0.85, keywords: ['chậm', 'thái độ', 'cải thiện'], source: 'Google', createdAt: '2026-03-05', status: 'FLAGGED' },
  { id: 9, content: 'Tuyệt vời! Món ăn chất lượng, phục vụ nhanh, giá tốt', sentiment: 'POSITIVE', confidence: 0.97, keywords: ['tuyệt vời', 'chất lượng', 'nhanh'], source: 'Facebook', createdAt: '2026-03-04', status: 'ANALYZED' },
  { id: 10, content: 'Bình thường, không có gì đặc biệt. Món ăn tạm được', sentiment: 'NEUTRAL', confidence: 0.51, keywords: ['bình thường', 'tạm'], source: 'CSV', createdAt: '2026-03-03', status: 'ANALYZED' },
  { id: 11, content: 'Không gian ấm cúng, cafe thơm ngon, sẽ giới thiệu bạn bè', sentiment: 'POSITIVE', confidence: 0.89, keywords: ['ấm cúng', 'thơm ngon'], source: 'Google', createdAt: '2026-03-02', status: 'ANALYZED' },
  { id: 12, content: 'Mất vệ sinh, bẩn, chén đĩa không sạch. Không ưng ý', sentiment: 'NEGATIVE', confidence: 0.93, keywords: ['mất vệ sinh', 'bẩn'], source: 'Facebook', createdAt: '2026-03-01', status: 'FLAGGED' },
];

// === SPRINT 3: Mock Users ===
export const mockUsers = [
  { id: 1, username: 'admin', fullName: 'Quan Tri Vien', email: 'admin@sentiment.com', role: 'ADMIN', createdAt: '2026-04-01' },
  { id: 2, username: 'manager', fullName: 'Nguyen Van Manager', email: 'manager@sentiment.com', role: 'MANAGER', createdAt: '2026-04-01' },
  { id: 3, username: 'analyst', fullName: 'Tran Thi Analyst', email: 'analyst@sentiment.com', role: 'ANALYST', createdAt: '2026-04-01' },
  { id: 4, username: 'analyst2', fullName: 'Le Van Analyst2', email: 'analyst2@sentiment.com', role: 'ANALYST', createdAt: '2026-04-05' },
  { id: 5, username: 'manager2', fullName: 'Pham Thi Manager2', email: 'manager2@sentiment.com', role: 'MANAGER', createdAt: '2026-04-08' },
];

// === SPRINT 4: Mock Data Sources ===
export const mockDataSources = [
  { id: 1, name: 'Google Reviews - Phở Việt', type: 'CSV', description: 'Dữ liệu review từ Google Maps', reviewCount: 150, createdAt: '2026-03-01', status: 'ACTIVE' },
  { id: 2, name: 'Facebook Reviews - Cafe Saigon', type: 'CSV', description: 'Dữ liệu review từ fanpage Facebook', reviewCount: 80, createdAt: '2026-03-05', status: 'ACTIVE' },
  { id: 3, name: 'Shopee Reviews - Phở Việt', type: 'API', description: 'Dữ liệu từ Shopee Food', reviewCount: 45, createdAt: '2026-03-10', status: 'INACTIVE' },
  { id: 4, name: 'CSV Import - Tháng 3', type: 'CSV', description: 'File CSV import thủ công', reviewCount: 200, createdAt: '2026-03-15', status: 'ACTIVE' },
];
