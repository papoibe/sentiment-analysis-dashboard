# Báo cáo Tuần 6

**Tuần:** 6 (05/04/2026 - 11/04/2026)  
**Nhóm:** 6  
**Đề tài:** #11 - Sentiment Analysis Dashboard  
**Nhóm trưởng:** Lê Nguyễn Phước Thịnh - 2251050068

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Lê Nguyễn Phước Thịnh | 2251050068 | Tích hợp OpenAI API cho Sentiment Analysis với fallback Mock Service | [65cce47](https://github.com/papoibe/sentiment-analysis-dashboard/commit/65cce47) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Implement KeywordExtractionService (DB matching + AI extraction) | [3af8d31](https://github.com/papoibe/sentiment-analysis-dashboard/commit/3af8d31) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Refactor UserService, implement GET /auth/me, fix DataSeeder dùng SentimentAnalyzer | [88562bf](https://github.com/papoibe/sentiment-analysis-dashboard/commit/88562bf) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Bổ sung entity, DTO, repository, exception còn thiếu | [586a1dc](https://github.com/papoibe/sentiment-analysis-dashboard/commit/586a1dc) |
| Lê Nguyễn Phước Thịnh | 2251050068 | Update ExportService (PDF/Excel) và dependency OpenPDF | [d93ba3e](https://github.com/papoibe/sentiment-analysis-dashboard/commit/d93ba3e) |
| Võ Thanh Hào | 2251050026 | Viết unit test cho MockSentimentService (7 test cases: positive/negative/neutral/edge cases) | [65cce47](https://github.com/papoibe/sentiment-analysis-dashboard/commit/65cce47) |
| Võ Thanh Hào | 2251050026 | Viết EntityTest kiểm tra mapping JPA 12 entities (12 test cases) | [586a1dc](https://github.com/papoibe/sentiment-analysis-dashboard/commit/586a1dc) |

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
| Backend – AI Integration (OpenAI API + Fallback) | Done | 100% |
| Backend – Unit Tests (20 tests) | Done | 100% |
| Frontend UI | Chưa bắt đầu | 0% |
| Testing & Documentation | Đang làm | 40% |

**Tổng tiến độ: 75%**

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Thịnh | Setup ReactJS + Vite project, tạo cấu trúc frontend (components, pages, routing) |
| Thịnh | Implement Layout (Sidebar, Header) và AuthContext (JWT management) |
| Hào | Implement trang Login/Register + Dashboard tổng quan |
| Hào | Tạo SVG icons cho navigation và các action buttons |

---

## 4. Khó khăn / Cần hỗ trợ

- OpenAI API bị giới hạn quota (429 Too Many Requests) → đã implement Mock fallback service để đảm bảo hệ thống vẫn hoạt động khi API lỗi.

---

*Ngày nộp: 11/04/2026*  
*Xác nhận của Nhóm trưởng: Lê Nguyễn Phước Thịnh*
