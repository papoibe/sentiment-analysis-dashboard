import api from './api';

// === UserService — Gọi API cho User Management (Admin) ===

// Lấy danh sách users — GET /api/v1/users
export const getUsers = async () => {
  const response = await api.get('/v1/users');
  return response.data;
};

// Tạo user mới — POST /api/v1/users
export const createUser = async (userData) => {
  const response = await api.post('/v1/users', userData);
  return response.data;
};

// Cập nhật user — PUT /api/v1/users/:id
export const updateUser = async (id, userData) => {
  const response = await api.put(`/v1/users/${id}`, userData);
  return response.data;
};

// Xóa user — DELETE /api/v1/users/:id
export const deleteUser = async (id) => {
  const response = await api.delete(`/v1/users/${id}`);
  return response.data;
};

// Đổi role user — PUT /api/v1/users/:id/role
export const changeUserRole = async (id, role) => {
  const response = await api.put(`/v1/users/${id}/role`, { role });
  return response.data;
};
