# Báo cáo Tuần 7

**Tuần:** 7 (12/04/2026 - 18/04/2026)  
**Nhóm:** 6  
**Đề tài:** #11 - Sentiment Analysis Dashboard  
**Nhóm trưởng:** Lê Nguyễn Phước Thịnh - 2251050068

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Lê Nguyễn Phước Thịnh | 2251050068 | Setup React Vite project, cấu trúc frontend (components, pages, routing, services) | [c1afa9b](https://github.com/papoibe/sentiment-analysis-dashboard/commit/c1afa9b) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement Layout (Sidebar + Header), AuthContext, ProtectedRoute phân quyền 3 role | [82feee2](https://github.com/papoibe/sentiment-analysis-dashboard/commit/82feee2) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement 10 pages: Dashboard, Reviews, Reports, DataSources, ReviewManagement, Alerts, UserManagement, SystemConfig, SystemReports, ReviewTracking | [82feee2](https://github.com/papoibe/sentiment-analysis-dashboard/commit/82feee2) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement 8 API service files (axios): auth, review, dataSource, report, alert, admin, user, dashboard | [82feee2](https://github.com/papoibe/sentiment-analysis-dashboard/commit/82feee2) |
| Võ Thanh Hào | 2251050026 | Tạo bộ SVG icons từ Flaticon cho toàn bộ navigation và action buttons | [dfefe87](https://github.com/papoibe/sentiment-analysis-dashboard/commit/dfefe87) |
| Võ Thanh Hào | 2251050026 | Chuẩn bị mock data cho tất cả pages (reviews, datasources, alerts, users) | [dfefe87](https://github.com/papoibe/sentiment-analysis-dashboard/commit/dfefe87) |
| Võ Thanh Hào | 2251050026 | PR: feature/hao-frontend-icons → merged vào main | [PR #11](https://github.com/papoibe/sentiment-analysis-dashboard/commit/c5253b1) |

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
| Backend – Business Logic & APIs | Done | 100% |
| Backend – AI Integration | Done | 100% |
| Backend – Unit Tests | Done | 100% |
| Frontend – Layout & Routing | Done | 100% |
| Frontend – Pages (10 trang) | Done | 100% |
| Frontend – API Services (8 files) | Done | 100% |
| Frontend – SVG Icons & Assets | Done | 100% |
| Frontend ↔ Backend Integration | Đang làm | 60% |
| SQL Migrations | Chưa bắt đầu | 0% |
| Testing & Documentation | Đang làm | 50% |

**Tổng tiến độ: 88%**

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Thịnh | Hoàn thiện Frontend ↔ Backend integration (10/10 pages kết nối API thật) |
| Thịnh | Tạo SQL migrations (V1__init_schema.sql, V2__seed_data.sql) |
| Hào | Thay thế emoji icons còn sót bằng SVG, kiểm tra responsive |
| Hào | Viết báo cáo tuần, chuẩn bị screenshots cho docs |

---

## 4. Khó khăn / Cần hỗ trợ

- Frontend có nhiều pages cần tích hợp API → phải đảm bảo fallback mockData khi backend chưa chạy.
- Cần đồng bộ response format giữa backend và frontend (ApiResponse wrapper).

---

*Ngày nộp: 18/04/2026*  
*Xác nhận của Nhóm trưởng: Lê Nguyễn Phước Thịnh*
