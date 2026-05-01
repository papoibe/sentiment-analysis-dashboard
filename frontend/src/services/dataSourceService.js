import api from './api';

// === DataSourceService — Gọi API cho Data Sources (Manager) ===
// Backend: @RequestMapping("/api/v1/data-sources") — có dấu gạch ngang

// Lấy danh sách data sources — GET /api/v1/data-sources
export const getDataSources = async () => {
  const response = await api.get('/v1/data-sources');
  return response.data;
};

// Tạo data source mới — POST /api/v1/data-sources
export const createDataSource = async (data) => {
  const response = await api.post('/v1/data-sources', data);
  return response.data;
};

// Cập nhật data source — PUT /api/v1/data-sources/:id
export const updateDataSource = async (id, data) => {
  const response = await api.put(`/v1/data-sources/${id}`, data);
  return response.data;
};

// Xóa data source — DELETE /api/v1/data-sources/:id
export const deleteDataSource = async (id) => {
  const response = await api.delete(`/v1/data-sources/${id}`);
  return response.data;
};

// Import CSV/Excel — POST /api/v1/data-sources/:id/import (multipart)
export const importFile = async (dataSourceId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/v1/data-sources/${dataSourceId}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
