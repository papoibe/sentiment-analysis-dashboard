# Phân Tích Yêu Cầu - Sentiment Analysis Dashboard

## 1. Tổng Quan Hệ Thống

### 1.1. Bối cảnh
Doanh nghiệp nhận hàng trăm reviews trên Google, Facebook mỗi ngày nhưng không có thời gian đọc hết. Họ bỏ lỡ những phản hồi tiêu cực quan trọng và không biết khách hàng thực sự nghĩ gì.

### 1.2. Giải pháp
Xây dựng dashboard cho phép:
- **Analyst** xem sentiment tổng quan, biểu đồ trend, top reviews và export báo cáo
- **Manager** quản lý data sources, import data, đánh dấu và assign review cần xử lý
- **Admin** quản lý users, cấu hình AI, báo cáo hệ thống
- **AI** tự động phân tích sentiment với confidence score

### 1.3. Yêu cầu tổng quan

| Thành phần | Yêu cầu |
|------------|---------|
| Số phân hệ (Roles) | 3 roles: Analyst, Manager, Admin |
| Tính năng/Role | 6 tính năng chính |
| Tổng tính năng | 18 tính năng |
| Số bảng Database | 8-10 bảng |
| Số API endpoints | 20-30 endpoints |
| Authentication | Đăng ký, Đăng nhập, Phân quyền (JWT) |
| CRUD đầy đủ | Users, DataSources, Reviews |

---

## 2. Đối Tượng Sử Dụng (Actors)

| Actor | Loại | Mô tả |
|-------|------|-------|
| Analyst | End User | Người phân tích dữ liệu - xem dashboard, biểu đồ trend, export báo cáo |
| Manager | Business User | Người quản lý - quản lý data sources, assign review, cấu hình alerts |
| Admin | System Admin | Quản trị hệ thống - quản lý users, cấu hình AI model, báo cáo hệ thống |

---

## 3. Tính Năng Chính (Functional Requirements)

### 3.1. Phân hệ ANALYST (6 tính năng)

#### UC-A01: Xem Dashboard Sentiment Tổng Quan
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Analyst xem tổng quan sentiment của tất cả reviews |
| Precondition | Analyst đã đăng nhập, có dữ liệu reviews trong hệ thống |
| Main Flow | 1. Analyst truy cập Dashboard → 2. Hệ thống hiển thị: tổng số reviews, tỷ lệ Positive/Negative/Neutral (pie chart), confidence score trung bình, số reviews mới trong tuần → 3. Analyst có thể filter theo data source, khoảng thời gian |
| Postcondition | Dashboard hiển thị với dữ liệu chính xác, realtime |

#### UC-A02: Xem Biểu Đồ Trend Theo Thời Gian
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Xem xu hướng sentiment thay đổi theo thời gian |
| Precondition | Có dữ liệu reviews đã được phân tích sentiment |
| Main Flow | 1. Analyst chọn "Trend Analysis" → 2. Hệ thống hiển thị biểu đồ line chart: trục X là thời gian, trục Y là số lượng/tỷ lệ sentiment → 3. Analyst chọn khoảng thời gian (7 ngày, 30 ngày, 90 ngày, custom) → 4. Có thể so sánh giữa các data sources |
| Postcondition | Biểu đồ trend được hiển thị chính xác |

#### UC-A03: Xem Top Positive/Negative Reviews
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Xem danh sách top reviews tích cực và tiêu cực nhất |
| Precondition | Có dữ liệu reviews đã phân tích sentiment |
| Main Flow | 1. Analyst chọn "Top Reviews" → 2. Hệ thống hiển thị 2 tab: Top Positive và Top Negative → 3. Mỗi review hiển thị: nội dung, sentiment label, confidence score, nguồn, ngày → 4. Có thể sắp xếp theo confidence score hoặc ngày |
| Postcondition | Danh sách top reviews hiển thị đúng |

#### UC-A04: Tìm Kiếm và Lọc Reviews
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Tìm kiếm reviews theo keyword, filter theo nhiều tiêu chí |
| Precondition | Có dữ liệu reviews |
| Main Flow | 1. Analyst nhập keyword vào ô search → 2. Có thể filter theo: sentiment (Positive/Negative/Neutral), data source, khoảng thời gian, confidence score range → 3. Kết quả hiển thị dạng bảng, phân trang |
| Postcondition | Kết quả tìm kiếm chính xác, phân trang |

#### UC-A05: Export Báo Cáo (PDF/Excel)
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Xuất báo cáo sentiment ra file PDF hoặc Excel |
| Precondition | Có dữ liệu trên dashboard |
| Main Flow | 1. Analyst chọn "Export" → 2. Chọn định dạng (PDF hoặc Excel) → 3. Chọn nội dung export: dashboard summary, trend chart, reviews list → 4. Hệ thống generate file và download |
| Postcondition | File báo cáo được tải về máy |

#### UC-A06: Tạo Custom Reports
| Mục | Nội dung |
|-----|----------|
| Actor | Analyst |
| Mô tả | Tạo báo cáo tùy chỉnh theo yêu cầu riêng |
| Precondition | Analyst đã đăng nhập |
| Main Flow | 1. Analyst chọn "Custom Report" → 2. Chọn metrics cần báo cáo, khoảng thời gian, data sources → 3. Đặt tên report → 4. Hệ thống generate và lưu report → 5. Có thể xem lại hoặc export |
| Postcondition | Custom report được tạo và lưu |

---

### 3.2. Phân hệ MANAGER (6 tính năng)

#### UC-M01: Quản Lý Data Sources (CRUD)
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Thêm/sửa/xóa/xem các nguồn dữ liệu reviews |
| Precondition | Manager đã đăng nhập |
| Main Flow | 1. Manager truy cập "Data Sources" → 2. Xem danh sách data sources hiện có → 3. Thêm mới: nhập tên, loại (Google/Facebook/CSV), mô tả → 4. Sửa thông tin → 5. Xóa (soft delete) |
| Postcondition | Data source được tạo/cập nhật/xóa |

#### UC-M02: Import Data Từ CSV/Excel
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Import reviews từ file CSV hoặc Excel vào hệ thống |
| Precondition | Manager đã tạo data source |
| Main Flow | 1. Manager chọn "Import Data" → 2. Chọn data source → 3. Upload file CSV/Excel → 4. Hệ thống validate format → 5. Preview dữ liệu → 6. Confirm import → 7. AI tự động phân tích sentiment cho reviews mới |
| Postcondition | Reviews được import và phân tích sentiment |

#### UC-M03: Đánh Dấu Review Cần Xử Lý
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Đánh dấu (flag) reviews quan trọng cần xử lý |
| Precondition | Có reviews trong hệ thống |
| Main Flow | 1. Manager xem danh sách reviews → 2. Click "Flag" trên review cần xử lý → 3. Chọn mức độ ưu tiên (High/Medium/Low) → 4. Thêm ghi chú (optional) |
| Postcondition | Review được đánh dấu cần xử lý |

#### UC-M04: Assign Review Cho Team Member
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Giao review cần xử lý cho thành viên trong team |
| Precondition | Review đã được flag, có users trong hệ thống |
| Main Flow | 1. Manager xem reviews đã flag → 2. Chọn review → 3. Assign cho team member từ dropdown → 4. Đặt deadline (optional) → 5. Hệ thống thông báo cho người được assign |
| Postcondition | Review được giao cho team member |

#### UC-M05: Theo Dõi Trạng Thái Xử Lý
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Xem tiến độ xử lý các reviews đã assign |
| Precondition | Có reviews đã assign |
| Main Flow | 1. Manager truy cập "Review Tracking" → 2. Xem danh sách reviews đã assign với trạng thái: Pending/In Progress/Resolved → 3. Filter theo trạng thái, người được assign, thời gian → 4. Xem chi tiết xử lý |
| Postcondition | Trạng thái xử lý hiển thị chính xác |

#### UC-M06: Cấu Hình Alerts
| Mục | Nội dung |
|-----|----------|
| Actor | Manager |
| Mô tả | Cấu hình cảnh báo tự động khi có reviews tiêu cực |
| Precondition | Manager đã đăng nhập |
| Main Flow | 1. Manager truy cập "Alert Settings" → 2. Tạo alert rule: điều kiện (ví dụ: khi có > 5 negative reviews trong 1 giờ), ngưỡng confidence score → 3. Chọn kênh thông báo (email, in-app) → 4. Bật/tắt alert |
| Postcondition | Alert rule được tạo và hoạt động |

---

### 3.3. Phân hệ ADMIN (6 tính năng)

#### UC-AD01: Quản Lý Users (CRUD)
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Thêm/sửa/xóa/xem users, phân quyền role |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "User Management" → 2. Xem danh sách users → 3. Thêm user: nhập email, tên, role (Analyst/Manager/Admin) → 4. Sửa thông tin user → 5. Vô hiệu hóa/kích hoạt user |
| Postcondition | User được tạo/cập nhật/vô hiệu hóa |

#### UC-AD02: Quản Lý Doanh Nghiệp
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Quản lý thông tin doanh nghiệp sử dụng hệ thống |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "Business Management" → 2. Thêm/sửa thông tin doanh nghiệp: tên, mô tả, logo → 3. Gán users cho doanh nghiệp |
| Postcondition | Thông tin doanh nghiệp được cập nhật |

#### UC-AD03: Cấu Hình AI Model
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Cấu hình AI model dùng để phân tích sentiment |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "AI Configuration" → 2. Cấu hình: OpenAI API key, model version (GPT-3.5/GPT-4), temperature, max tokens → 3. Test connection → 4. Xem thống kê API usage |
| Postcondition | AI model được cấu hình và hoạt động |

#### UC-AD04: Quản Lý Keywords Tracking
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Quản lý danh sách keywords cần theo dõi trong reviews |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "Keywords" → 2. Thêm keyword cần track (ví dụ: "chất lượng kém", "phục vụ tốt") → 3. Phân loại keyword theo nhóm → 4. Bật/tắt tracking |
| Postcondition | Keywords được cập nhật và hệ thống bắt đầu track |

#### UC-AD05: Báo Cáo Hệ Thống
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Xem báo cáo tổng quan về hoạt động hệ thống |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "System Reports" → 2. Xem: tổng số users, tổng reviews, API usage, storage usage → 3. Biểu đồ hoạt động theo thời gian → 4. Export báo cáo |
| Postcondition | Báo cáo hệ thống hiển thị chính xác |

#### UC-AD06: Quản Lý Thông Báo
| Mục | Nội dung |
|-----|----------|
| Actor | Admin |
| Mô tả | Quản lý và gửi thông báo hệ thống về đến users |
| Precondition | Admin đã đăng nhập |
| Main Flow | 1. Admin truy cập "Notifications" → 2. Tạo thông báo: tiêu đề, nội dung, đối tượng nhận → 3. Chọn gửi ngay hoặc hẹn giờ → 4. Xem lịch sử thông báo đã gửi |
| Postcondition | Thông báo được gửi đến users |

---

## 4. AI Features

### 4.1. Sentiment Classification
- **Input:** Nội dung review (text)
- **Output:** Label (Positive/Negative/Neutral) + Confidence Score (0-100%)
- **Công nghệ:** OpenAI GPT API
- **Xử lý:** Gọi API khi import data hoặc khi có review mới

### 4.2. Keyword Extraction
- **Input:** Nội dung review (text)
- **Output:** Danh sách keywords quan trọng
- **Công nghệ:** OpenAI GPT API
- **Xử lý:** Trích xuất từ khóa chính từ mỗi review

### 4.3. Trend Analysis
- **Input:** Tập hợp reviews theo thời gian
- **Output:** Xu hướng sentiment tăng/giảm, keywords phổ biến theo thời gian
- **Xử lý:** Tổng hợp và tính toán dựa trên dữ liệu đã phân tích

---

## 5. Non-Functional Requirements

| Yêu cầu | Mô tả |
|----------|-------|
| **Security** | Spring Security + JWT Token, phân quyền Role-based (RBAC) |
| **Performance** | Dashboard load < 3 giây, API response < 1 giây |
| **AI API** | Sử dụng OpenAI API, xử lý lỗi khi API timeout/unavailable |
| **Export** | Hỗ trợ PDF (sử dụng iText/JasperReports) và Excel (Apache POI) |
| **Import** | Hỗ trợ CSV và Excel, validate format trước khi import |
| **Responsive** | Giao diện tương thích desktop (responsive là bonus) |
| **Database** | PostgreSQL, sử dụng JPA/Hibernate ORM |

---

## 6. Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Spring Boot (Java 17+) |
| Database | PostgreSQL |
| Frontend | ReactJS |
| AI | OpenAI API (GPT-3.5/GPT-4) |
| Security | Spring Security + JWT |
| API Style | RESTful API |
| Build Tool | Maven |
| Version Control | Git + GitHub |
| Export PDF | iText hoặc JasperReports |
| Export Excel | Apache POI |
| Charts | Recharts hoặc Chart.js |

---

## 7. Dataset

### 7.1. Dataset chính: Vietnamese Food Reviews (Kaggle)
- **Nguồn:** Kaggle – Vietnamese Sentiment Analysis Food Reviews
- **Ngôn ngữ:** Tiếng Việt
- **Kích thước:**
  - `vsa_food_rv_train.csv`: ~62,975 reviews (có nhãn Rating: 0 = Negative, 1 = Positive)
  - `vsa_food_rv_test.csv`: ~28,585 reviews (chỉ có Comment, không có nhãn)
  - `vietnamese-stopwords-dash.txt`: 1,942 stopwords tiếng Việt
- **Cấu trúc:**
  - Cột `Comment`: Nội dung review tiếng Việt
  - Cột `Rating`: Nhãn sentiment (0.0 = Tiêu cực, 1.0 = Tích cực)

### 7.2. Xử lý nhãn Neutral
Dataset gốc chỉ có 2 nhãn (Positive/Negative). Để đáp ứng yêu cầu 3 nhãn (Positive/Negative/Neutral):
- Khi AI model classify, confidence score nằm trong ngưỡng **0.4 – 0.6** → gán nhãn **Neutral**
- Confidence ≥ 0.6 → **Positive**
- Confidence ≤ 0.4 → **Negative**

### 7.3. Cách sử dụng trong hệ thống
- **Train AI model:** Dùng `vsa_food_rv_train.csv` (split 80/20 thành train/validation)
- **Demo tính năng Manager Import:** Dùng `vsa_food_rv_test.csv` → Manager upload CSV → AI phân tích sentiment
- **Tiền xử lý text:** Dùng `vietnamese-stopwords-dash.txt` để loại bỏ stopwords
- **Timestamp:** Khi import, hệ thống tự gắn `created_at` cho mỗi review để hỗ trợ Trend Analysis
