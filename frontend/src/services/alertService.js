import api from './api';

// === AlertService — Gọi API cho Alerts (Manager) ===

// Lấy danh sách alerts — GET /api/v1/alerts
export const getAlerts = async () => {
  const response = await api.get('/v1/alerts');
  return response.data;
};

// Tạo alert rule mới — POST /api/v1/alerts
export const createAlert = async (alertData) => {
  const response = await api.post('/v1/alerts', alertData);
  return response.data;
};

// Cập nhật alert rule — PUT /api/v1/alerts/:id
export const updateAlert = async (id, alertData) => {
  const response = await api.put(`/v1/alerts/${id}`, alertData);
  return response.data;
};

// Xóa alert rule — DELETE /api/v1/alerts/:id
export const deleteAlert = async (id) => {
  const response = await api.delete(`/v1/alerts/${id}`);
  return response.data;
};

// Toggle active/inactive — PUT /api/v1/alerts/:id/toggle
export const toggleAlert = async (id) => {
  const response = await api.put(`/v1/alerts/${id}/toggle`);
  return response.data;
};
