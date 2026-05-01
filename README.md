# Sentiment Analysis Dashboard

Hệ thống phân tích cảm xúc khách hàng từ reviews trên các nền tảng Google, Facebook, Shopee Food. Sử dụng AI (OpenAI GPT API) để tự động phân loại sentiment (Positive/Negative/Neutral) kèm confidence score, hiển thị dashboard analytics trực quan, và hỗ trợ quản lý quy trình xử lý review.

## Thành viên nhóm

| MSSV | Họ tên | Vai trò |
|------|--------|---------|
| 2251050068 | Lê Nguyễn Phước Thịnh | Nhóm trưởng, Backend Dev, Frontend Dev |
| 2251050026 | Võ Thanh Hào | Backend Dev, Frontend Dev, QA/Tester |

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|-----------|-----------|
| Backend | Spring Boot 4.0 (Java 17+) |
| Frontend | ReactJS 19 + Vite 8 |
| Database | H2 (dev) / PostgreSQL (prod) |
| AI/NLP | OpenAI GPT API — Sentiment Classification + Keyword Extraction |
| Security | Spring Security + JWT |
| API Style | RESTful API (30+ endpoints) |
| API Docs | Swagger UI (springdoc-openapi v2.8.7) |
| Build Tools | Maven (backend), npm (frontend) |
| Version Control | Git + GitHub |

## Tính năng chính (18 tính năng — 3 phân hệ)

### Analyst (End User)
- Xem dashboard sentiment tổng quan (biểu đồ Recharts)
- Xem biểu đồ trend theo thời gian
- Xem top positive/negative reviews
- Tìm kiếm và lọc reviews
- Export báo cáo PDF/Excel
- Tạo và quản lý custom reports

### Manager (Business User)
- Quản lý data sources (CRUD)
- Import data từ CSV
- Đánh dấu (flag) review cần xử lý
- Assign review cho analyst
- Theo dõi trạng thái xử lý
- Cấu hình alert rules

### Admin
- Quản lý users (CRUD)
- Quản lý doanh nghiệp
- Cấu hình AI model
- Quản lý keywords tracking
- Báo cáo hệ thống
- Quản lý thông báo

## Cài đặt và chạy

### Yêu cầu
- Java 17+
- Node.js 18+
- Maven 3.9+

### Chạy Backend
```bash
cd backend
mvn spring-boot:run
```
Backend chạy tại: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui.html

### Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: http://localhost:5173

### Tài khoản demo
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Manager | manager | manager123 |
| Analyst | analyst | analyst123 |

## Cấu trúc dự án

```
sentiment-analysis-dashboard/
├── README.md
├── docs/
│   ├── requirements.md          # Phân tích yêu cầu
│   ├── database-design.md       # Thiết kế database
│   ├── api-docs.md              # API documentation
│   └── screenshots/             # Screenshots demo
├── weekly-reports/              # Báo cáo tiến độ hàng tuần
│   ├── week-1.md → week-8.md
├── database/
│   └── migrations/
│       ├── V1__init_schema.sql  # Schema 11 bảng
│       └── V2__seed_data.sql    # Seed data demo
├── backend/
│   └── src/main/java/.../
│       ├── config/              # CORS, DataSeeder, AI config
│       ├── controller/          # 8 REST Controllers (37 endpoints)
│       ├── dto/                 # Request/Response DTOs
│       ├── entity/              # 12 JPA Entities
│       ├── exception/           # Global Exception Handler
│       ├── repository/          # JPA Repositories
│       ├── security/            # JWT Auth Filter, Security Config
│       └── service/             # Business Logic, AI Sentiment
└── frontend/
    └── src/
        ├── assets/              # SVG icons
        ├── components/          # Layout, DataTable, Badges, Charts
        ├── contexts/            # AuthContext (JWT management)
        ├── pages/               # 4 role folders (auth/analyst/manager/admin)
        ├── services/            # 8 API service files (Axios)
        └── utils/               # Mock data, helpers
```

## Demo

> Screenshots được lưu tại `docs/screenshots/`

## Tài liệu

- [Phân tích yêu cầu](docs/requirements.md)
- [Thiết kế Database](docs/database-design.md)
- [API Documentation](docs/api-docs.md)
