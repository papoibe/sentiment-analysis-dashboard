import api from './api';

// === AdminService — Gọi API cho Admin (Config, Keywords, Business, System) ===
// Backend AdminController base: /api/v1

// Lấy cấu hình AI — GET /api/v1/config/ai
export const getAiConfig = async () => {
  const response = await api.get('/v1/config/ai');
  return response.data;
};

// Cập nhật cấu hình AI — PUT /api/v1/config/ai
export const updateAiConfig = async (config) => {
  const response = await api.put('/v1/config/ai', config);
  return response.data;
};

// Test AI connection — POST /api/v1/config/ai/test
export const testAiConnection = async () => {
  const response = await api.post('/v1/config/ai/test');
  return response.data;
};

// === Keywords ===

// Lấy danh sách keywords — GET /api/v1/keywords
export const getKeywords = async () => {
  const response = await api.get('/v1/keywords');
  return response.data;
};

// Thêm keyword — POST /api/v1/keywords
export const createKeyword = async (data) => {
  const response = await api.post('/v1/keywords', data);
  return response.data;
};

// Xóa keyword — DELETE /api/v1/keywords/:id
export const deleteKeyword = async (id) => {
  const response = await api.delete(`/v1/keywords/${id}`);
  return response.data;
};

// === Businesses ===

// Lấy danh sách businesses — GET /api/v1/businesses
export const getBusinesses = async () => {
  const response = await api.get('/v1/businesses');
  return response.data;
};

// Thêm business — POST /api/v1/businesses
export const createBusiness = async (data) => {
  const response = await api.post('/v1/businesses', data);
  return response.data;
};

// Xóa business — DELETE /api/v1/businesses/:id
export const deleteBusiness = async (id) => {
  const response = await api.delete(`/v1/businesses/${id}`);
  return response.data;
};

// === System Reports ===

// Lấy thống kê hệ thống — GET /api/v1/reports/system
export const getSystemStats = async () => {
  const response = await api.get('/v1/reports/system');
  return response.data;
};

// Lấy thông báo hệ thống — GET /api/v1/notifications
export const getNotifications = async () => {
  const response = await api.get('/v1/notifications');
  return response.data;
};

// Tạo thông báo — POST /api/v1/notifications
export const createNotification = async (data) => {
  const response = await api.post('/v1/notifications', data);
  return response.data;
};

// Xóa thông báo — DELETE /api/v1/notifications/:id
export const deleteNotification = async (id) => {
  const response = await api.delete(`/v1/notifications/${id}`);
  return response.data;
};
