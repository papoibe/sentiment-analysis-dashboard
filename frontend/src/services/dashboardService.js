import api from './api';

// Lấy thống kê tổng quan — GET /api/v1/dashboard/summary
export const getDashboardSummary = async () => {
  const response = await api.get('/v1/dashboard/summary');
  return response.data;
};

// Lấy dữ liệu trend — GET /api/v1/dashboard/trend?period=30d
export const getDashboardTrend = async (period = '30d') => {
  const response = await api.get(`/v1/dashboard/trend?period=${period}`);
  return response.data;
};
