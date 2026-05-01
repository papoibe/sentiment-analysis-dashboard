import api from './api';

// === ReportService — Gọi API cho Reports (Analyst) ===

// Export báo cáo PDF/Excel/JSON — GET /api/v1/reports/export?format=pdf
// Backend dùng GET (không phải POST), trả blob binary
export const exportReport = async ({ format = 'pdf', dateFrom, dateTo }) => {
  // Xây dựng query params cho backend
  const params = new URLSearchParams();
  params.append('format', format.toLowerCase());
  if (dateFrom) params.append('fromDate', dateFrom);
  if (dateTo) params.append('toDate', dateTo);

  const response = await api.get(`/v1/reports/export?${params.toString()}`, {
    responseType: 'blob', // Nhận file binary từ server
  });
  return response;
};

// Lấy danh sách custom reports — GET /api/v1/reports/custom
export const getReports = async () => {
  const response = await api.get('/v1/reports/custom');
  return response.data;
};

// Tạo custom report — POST /api/v1/reports/custom
export const createReport = async (reportData) => {
  const response = await api.post('/v1/reports/custom', reportData);
  return response.data;
};

// Xóa report — DELETE /api/v1/reports/custom/:id (nếu backend hỗ trợ)
export const deleteReport = async (id) => {
  const response = await api.delete(`/v1/reports/custom/${id}`);
  return response.data;
};

// Download report — GET /api/v1/reports/custom/:id (nếu backend hỗ trợ)
export const downloadReport = async (id) => {
  const response = await api.get(`/v1/reports/custom/${id}`, {
    responseType: 'blob',
  });
  return response;
};
