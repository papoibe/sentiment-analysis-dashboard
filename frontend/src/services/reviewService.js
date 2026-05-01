import api from './api';

// === ReviewService — Gọi API cho Reviews ===

// Lấy danh sách reviews (có phân trang, filter) — GET /api/v1/reviews
export const getReviews = async (params = {}) => {
  const response = await api.get('/v1/reviews', { params });
  return response.data;
};

// Lấy chi tiết 1 review — GET /api/v1/reviews/:id
export const getReviewById = async (id) => {
  const response = await api.get(`/v1/reviews/${id}`);
  return response.data;
};

// Lấy top reviews (positive/negative) — GET /api/v1/reviews/top
export const getTopReviews = async (type = 'positive', limit = 10) => {
  const response = await api.get('/v1/reviews/top', { params: { type, limit } });
  return response.data;
};

// Tìm kiếm reviews — GET /api/v1/reviews/search
export const searchReviews = async (query, params = {}) => {
  const response = await api.get('/v1/reviews/search', { params: { q: query, ...params } });
  return response.data;
};

// === MANAGER: Flag + Assign ===

// Flag review — PUT /api/v1/reviews/:id/flag
export const flagReview = async (id, flagData) => {
  const response = await api.put(`/v1/reviews/${id}/flag`, flagData);
  return response.data;
};

// Assign review cho analyst — PUT /api/v1/reviews/:id/assign
export const assignReview = async (id, assignData) => {
  const response = await api.put(`/v1/reviews/${id}/assign`, assignData);
  return response.data;
};

// Cập nhật trạng thái review — PUT /api/v1/reviews/:id/status
export const updateReviewStatus = async (id, status) => {
  const response = await api.put(`/v1/reviews/${id}/status`, { status });
  return response.data;
};

// Phân tích sentiment bằng AI — POST /api/v1/reviews/:id/analyze
export const analyzeReview = async (id) => {
  const response = await api.post(`/v1/reviews/${id}/analyze`);
  return response.data;
};

// Lấy danh sách assignments (reviews đã assign) — GET /api/v1/reviews/assignments
export const getAssignments = async (params = {}) => {
  const response = await api.get('/v1/reviews/assignments', { params });
  return response.data;
};
