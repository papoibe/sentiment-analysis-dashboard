import api from './api';

// Gọi API đăng nhập — POST /api/auth/login
// Backend trả: { success, message, data: { accessToken, tokenType, expiresIn, user } }
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const apiResponse = response.data; // ApiResponse wrapper
  return apiResponse.data; // AuthResponse: { accessToken, tokenType, expiresIn, user }
};

// Gọi API đăng ký — POST /api/auth/register
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Lấy thông tin user hiện tại — GET /api/auth/me
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
