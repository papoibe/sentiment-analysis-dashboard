# Báo cáo Tuần 5

**Tuần:** 5 (28/03/2026 - 04/04/2026)  
**Nhóm:** 6  
**Đề tài:** #11 - Sentiment Analysis Dashboard  
**Nhóm trưởng:** Lê Nguyễn Phước Thịnh - 2251050068

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Võ Thanh Hào | 2251050026 | Tạo các Entity còn lại: Alert, Business, CustomReport, DataSource, Keyword, Notification, ReviewAssignment, ReviewKeyword, SentimentResult | [2012148](https://github.com/papoibe/sentiment-analysis-dashboard/commit/2012148) |
| Võ Thanh Hào | 2251050026 | Tạo DTO cơ bản (ApiResponse, ApiError, LoginRequest, RegisterRequest, AuthResponse) + Exception Handler (GlobalExceptionHandl, ResourceNotFoundException, DuplicateResourceException) | [693945e](https://github.com/papoibe/sentiment-analysis-dashboard/commit/693945e) |
| Võ Thanh Hào | 2251050026 | Tạo Repository cốt lõi: UserRepository, BusinessRepository, ReviewRepository, KeywordRepository | [aa02edc](https://github.com/papoibe/sentiment-analysis-dashboard/commit/aa02edc) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Tạo DTO nghiệp vụ (DashboardSummaryResponse, ReviewResponse, TrendDataPoint, UserRequest/Response, FlagReviewRequest, AssignReviewRequest) + Repository nâng cao (8 repo: Alert, CustomReport, DataSource, Notification, ReviewAssignment, ReviewKeyword, RoleBasedUser, SentimentResult) | [e419034](https://github.com/papoibe/sentiment-analysis-dashboard/commit/e419034) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement Security JWT (JwtService, JwtAuthenticationFilter, SecurityConfig, UserDetailsServiceImpl) + Config (DataSeeder, JwtProperties, OpenApiConfig) | [1581eae](https://github.com/papoibe/sentiment-analysis-dashboard/commit/1581eae) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement Service layer: AuthService, DashboardService, DataSourceService, ExportService, SentimentService, UserMapper, UserService | [f5edbba](https://github.com/papoibe/sentiment-analysis-dashboard/commit/f5edbba) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement 8 Controllers (41 endpoints): Auth, Dashboard, Review, Report, DataSource, Alert, User, Admin + cấu hình application.yaml + sửa lại pom.xml và Entity | [e5564f2](https://github.com/papoibe/sentiment-analysis-dashboard/commit/e5564f2) |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Thành lập nhóm, chọn đề tài | Done | 100% |
| Chọn dataset | Done | 100% |
| Phân tích yêu cầu (docs/requirements.md) | Done | 100% |
| Thiết kế Database (docs/database-design.md) | Done | 100% |
| Thiết kế API (docs/api-docs.md) | Done | 100% |
| Backend – Entities & Repositories | Done | 100% |
| Backend – Authentication & Security (JWT) | Done | 100% |
| Backend – Business Logic & APIs (41 endpoints) | Done | 100% |
| Backend – Export PDF/Excel | Done | 100% |
| Backend – AI Integration (OpenAI API) | Chưa bắt đầu | 0% |
| Frontend UI | Chưa bắt đầu | 0% |
| Testing & Documentation | Đang làm | 20% |

**Tổng tiến độ: 65%**

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Thịnh | Tích hợp OpenAI API cho Sentiment Classification (gọi GPT-3.5-turbo, trả confidence score) |
| Thịnh | Implement Keyword Extraction tự động từ nội dung review |
| Hào | Setup ReactJS project, tạo cấu trúc frontend |
| Hào | Implement trang Login/Register + Dashboard tổng quan (biểu đồ sentiment) |

---

## 4. Khó khăn / Cần hỗ trợ


---

*Ngày nộp: 28/03/2026*  
*Xác nhận của Nhóm trưởng: Lê Nguyễn Phước Thịnh*
