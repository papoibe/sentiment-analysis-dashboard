# Báo cáo Tuần 4

**Tuần:** 4 (21/03/2026 - 28/03/2026)  
**Nhóm:** 6  
**Đề tài:** #11 - Sentiment Analysis Dashboard  
**Nhóm trưởng:** Lê Nguyễn Phước Thịnh - 2251050068

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Lê Nguyễn Phước Thịnh | 2251050068 | Setup Spring Boot project – cấu hình pom.xml (dependencies) và application.properties | [21c3b1f](https://github.com/papoibe/sentiment-analysis-dashboard/commit/21c3b1f) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Tạo Entity Review – mapping bảng reviews trong database | [9503c70](https://github.com/papoibe/sentiment-analysis-dashboard/commit/9503c70) |
| Võ Thanh Hào | 2251050026 | Tạo Entity User + Enum Role – mapping bảng users và phân quyền ANALYST/MANAGER/ADMIN | [56e5af5](https://github.com/papoibe/sentiment-analysis-dashboard/commit/56e5af5) |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Thành lập nhóm, chọn đề tài | Done | 100% |
| Chọn dataset | Done | 100% |
| Phân tích yêu cầu (docs/requirements.md) | Done | 100% |
| Thiết kế Database (docs/database-design.md) | Done | 100% |
| Thiết kế API (docs/api-docs.md) | Done | 100% |
| Backend – Entities & Repositories | Đang làm | 30% |
| Backend – Authentication & Security | Chưa bắt đầu | 0% |
| Backend – Business Logic & APIs | Chưa bắt đầu | 0% |
| Frontend UI | Chưa bắt đầu | 0% |
| AI Integration (OpenAI API) | Chưa bắt đầu | 0% |
| Testing | Chưa bắt đầu | 0% |

**Tổng tiến độ: 45%**

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hào | Tạo các Entity còn lại (Alert, Business, DataSource, Keyword, Notification...) |
| Hào | Tạo DTO cơ bản (ApiResponse, LoginRequest, AuthResponse) và Exception Handler |
| Hào | Tạo Repository cốt lõi (UserRepository, BusinessRepository, ReviewRepository) |
| Thịnh | Implement Security JWT (Authentication & Authorization) |
| Thịnh | Implement Service layer (AuthService, DashboardService, SentimentService) |
| Thịnh | Implement Controller layer – 8 controllers, ~41 API endpoints |

---

## 4. Khó khăn / Cần hỗ trợ


---

*Ngày nộp: 28/03/2026*  
*Xác nhận của Nhóm trưởng: Lê Nguyễn Phước Thịnh*
