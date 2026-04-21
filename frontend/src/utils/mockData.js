export const mockReviews = [
  {
    id: 1,
    content: "Phở rất ngon, nước dùng đậm đà, thịt bò tươi",
    sentiment: "POSITIVE",
    confidence: 0.92,
    keywords: ["phở", "ngon", "đậm đà"],
    source: "Google",
    createdAt: "2026-03-12"
  },
  {
    id: 2,
    content: "Dịch vụ tệ quá, đợi lâu mà không được phục vụ",
    sentiment: "NEGATIVE",
    confidence: 0.88,
    keywords: ["dịch vụ", "tệ", "đợi lâu"],
    source: "Facebook",
    createdAt: "2026-03-11"
  },
  {
    id: 3,
    content: "Quán ổn, giá hợp lý nhưng hơi đông",
    sentiment: "NEUTRAL",
    confidence: 0.65,
    keywords: ["ổn", "giá", "đông"],
    source: "Shopee",
    createdAt: "2026-03-10"
  },
  {
    id: 4,
    content: "Nhân viên thân thiện, phục vụ nhanh",
    sentiment: "POSITIVE",
    confidence: 0.90,
    keywords: ["nhân viên", "thân thiện"],
    source: "Google",
    createdAt: "2026-03-09"
  },
  {
    id: 5,
    content: "Đồ ăn nguội, không ngon như mong đợi",
    sentiment: "NEGATIVE",
    confidence: 0.87,
    keywords: ["nguội", "không ngon"],
    source: "Facebook",
    createdAt: "2026-03-08"
  },
  {
    id: 6,
    content: "Không gian sạch sẽ, thoáng mát",
    sentiment: "POSITIVE",
    confidence: 0.91,
    keywords: ["sạch", "thoáng"],
    source: "CSV",
    createdAt: "2026-03-07"
  },
  {
    id: 7,
    content: "Chờ hơi lâu nhưng đồ ăn ổn",
    sentiment: "NEUTRAL",
    confidence: 0.60,
    keywords: ["chờ lâu", "ổn"],
    source: "Shopee",
    createdAt: "2026-03-06"
  },
  {
    id: 8,
    content: "Tuyệt vời, sẽ quay lại lần sau",
    sentiment: "POSITIVE",
    confidence: 0.95,
    keywords: ["tuyệt vời"],
    source: "Google",
    createdAt: "2026-03-05"
  },
  {
    id: 9,
    content: "Giá cao so với chất lượng",
    sentiment: "NEGATIVE",
    confidence: 0.89,
    keywords: ["giá cao"],
    source: "Facebook",
    createdAt: "2026-03-04"
  },
  {
    id: 10,
    content: "Ổn áp, không có gì đặc biệt",
    sentiment: "NEUTRAL",
    confidence: 0.55,
    keywords: ["ổn"],
    source: "CSV",
    createdAt: "2026-03-03"
  }
];



export const mockUsers = [
  {
    id: 1,
    username: "admin",
    fullName: "Quan Tri Vien",
    email: "admin@sentiment.com",
    role: "ADMIN",
    createdAt: "2026-04-01"
  },
  {
    id: 2,
    username: "analyst01",
    fullName: "Nguyen Van A",
    email: "a.nguyen@sentiment.com",
    role: "ANALYST",
    createdAt: "2026-04-02"
  },
  {
    id: 3,
    username: "user01",
    fullName: "Tran Thi B",
    email: "b.tran@sentiment.com",
    role: "USER",
    createdAt: "2026-04-03"
  },
  {
    id: 4,
    username: "data_guy",
    fullName: "Le Van C",
    email: "c.le@sentiment.com",
    role: "ANALYST",
    createdAt: "2026-04-04"
  }
];


export const mockDataSources = [
  {
    id: 1,
    name: "Google Reviews - Phở Việt",
    type: "CSV",
    description: "Dữ liệu review từ Google Maps",
    reviewCount: 150,
    createdAt: "2026-03-01"
  },
  {
    id: 2,
    name: "Facebook Comments",
    type: "API",
    description: "Thu thập từ Facebook Graph API",
    reviewCount: 320,
    createdAt: "2026-03-05"
  },
  {
    id: 3,
    name: "Shopee Feedback",
    type: "CSV",
    description: "Review từ Shopee Food",
    reviewCount: 210,
    createdAt: "2026-03-07"
  },
  {
    id: 4,
    name: "Manual Upload",
    type: "CSV",
    description: "Upload thủ công từ người dùng",
    reviewCount: 90,
    createdAt: "2026-03-10"
  }
];


export const mockDashboard = {
  totalReviews: 1247,
  avgConfidence: 85.2,
  positiveCount: 812,
  negativeCount: 310,
  neutralCount: 125,

  sentimentBySource: [
    { source: "Google", count: 520 },
    { source: "Facebook", count: 380 },
    { source: "CSV", count: 250 },
    { source: "Shopee", count: 97 }
  ],

  sentimentTrend: [
    { date: "2026-03-01", positive: 30, negative: 10, neutral: 5 },
    { date: "2026-03-02", positive: 45, negative: 15, neutral: 8 },
    { date: "2026-03-03", positive: 50, negative: 20, neutral: 10 },
    { date: "2026-03-04", positive: 60, negative: 25, neutral: 12 }
  ],

  topKeywords: [
    { keyword: "ngon", count: 120 },
    { keyword: "dịch vụ", count: 80 },
    { keyword: "giá", count: 65 },
    { keyword: "nhân viên", count: 50 },
    { keyword: "đợi lâu", count: 40 }
  ]
};