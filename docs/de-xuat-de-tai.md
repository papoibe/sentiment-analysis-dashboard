# Đề Xuất Đề Tài Bài Tập Lớn

## 1. Thông Tin Nhóm
- Nhóm: 6
- Thành viên:
  1. Lê Nguyễn Phước Thịnh - 2251050068 (Nhóm trưởng)
  2. Võ Thanh Hào - 2251050026
- GVHD: Võ Việt Khoa 

## 2. Thông Tin Đề Tài
- Tên đề tài: Sentiment Analysis Dashboard
- Mô tả ngắn: Xây dựng dashboard phân tích cảm xúc (sentiment) từ reviews khách hàng. AI tự động phân loại Positive/Negative/Neutral với confidence score, hiển thị biểu đồ trend theo thời gian, hỗ trợ export báo cáo PDF/Excel.
- Đối tượng sử dụng:
  + Analyst (End User): Xem dashboard, biểu đồ trend, export báo cáo
  + Manager (Business User): Quản lý data sources, assign review, cấu hình alerts
  + Admin: Quản lý users, cấu hình AI, báo cáo hệ thống

## 3. Tính Năng Chính (MVP)

### ANALYST (6 tính năng):
- [ ] Xem dashboard sentiment tổng quan
- [ ] Xem biểu đồ trend theo thời gian
- [ ] Xem top positive/negative reviews
- [ ] Tìm kiếm và lọc reviews
- [ ] Export báo cáo (PDF/Excel)
- [ ] Tạo custom reports

### MANAGER (6 tính năng):
- [ ] Quản lý data sources (CRUD)
- [ ] Import data từ CSV/Excel
- [ ] Đánh dấu review cần xử lý
- [ ] Assign review cho team member
- [ ] Theo dõi trạng thái xử lý
- [ ] Cấu hình alerts

### ADMIN (6 tính năng):
- [ ] Quản lý users (CRUD)
- [ ] Quản lý doanh nghiệp
- [ ] Cấu hình AI model
- [ ] Quản lý keywords tracking
- [ ] Báo cáo hệ thống
- [ ] Quản lý thông báo

### AI Features:
- [ ] Sentiment Classification (Positive/Negative/Neutral + confidence score)
- [ ] Keyword Extraction
- [ ] Trend Analysis

## 4. Công Nghệ Sử Dụng
- Backend: Spring Boot (Java 17+)
- Database: PostgreSQL
- Frontend: ReactJS
- AI: OpenAI API (GPT)
- Security: Spring Security + JWT
- Other: Docker (optional), CI/CD (optional)

## 5. Phân Công Công Việc
| Thành viên | Công việc | Timeline |
|------------|-----------|----------|
| Thịnh (2251050068) | PM, Backend (Auth, AI, DB design), Frontend (Dashboard, Charts, Export) | Week 1-10 |
| Hào (2251050026) | Backend (APIs, Business Logic), Frontend (Management pages, Forms), QA | Week 1-10 |

## 6. Timeline
- Week 1-2: Analysis & Design
- Week 3-5: Backend Development (Core + Auth)
- Week 6-7: Backend (Business Logic + AI Integration)
- Week 8: Frontend Development
- Week 9: Testing & Bug fixes
- Week 10: Documentation & Presentation
