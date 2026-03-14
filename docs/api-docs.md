# API Documentation - Sentiment Analysis Dashboard

## Tổng Quan

- **Base URL:** `http://localhost:8080/api/v1`
- **Authentication:** JWT Bearer Token
- **Format:** JSON
- **Tổng endpoints:** 30

### Headers chung

```
Content-Type: application/json
Authorization: Bearer <jwt_token>    (trừ các API public: register, login)
```

### Response format chung

```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": { ... },
  "timestamp": "2026-03-12T00:00:00"
}
```

### Error format

```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "error_code": "ERROR_CODE",
  "timestamp": "2026-03-12T00:00:00"
}
```

### Phân quyền

| Role | Truy cập |
|------|----------|
| ANALYST | Dashboard, Reviews (read), Export, Custom Reports |
| MANAGER | Data Sources, Import, Flag/Assign Reviews, Alerts |
| ADMIN | Users, Businesses, AI Config, Keywords, System Reports, Notifications |

---

## 1. Authentication APIs (Public - 3 endpoints)

### 1.1. POST `/auth/register` – Đăng ký tài khoản

**Request:**
```json
{
  "email": "analyst@example.com",
  "password": "password123",
  "full_name": "Nguyễn Văn A"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "analyst@example.com",
    "full_name": "Nguyễn Văn A",
    "role": "ANALYST"
  }
}
```

### 1.2. POST `/auth/login` – Đăng nhập

**Request:**
```json
{
  "email": "analyst@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "email": "analyst@example.com",
      "full_name": "Nguyễn Văn A",
      "roles": ["ANALYST"]
    }
  }
}
```

### 1.3. GET `/auth/me` – Lấy thông tin user hiện tại

**Authorization:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "analyst@example.com",
    "full_name": "Nguyễn Văn A",
    "roles": ["ANALYST"],
    "is_active": true,
    "created_at": "2026-03-01T10:00:00"
  }
}
```

---

## 2. Analyst APIs (Role: ANALYST - 7 endpoints)

### 2.1. GET `/dashboard/summary` – Dashboard tổng quan

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `data_source_id` | Long (optional) | Lọc theo nguồn |
| `from_date` | String (optional) | Từ ngày (yyyy-MM-dd) |
| `to_date` | String (optional) | Đến ngày (yyyy-MM-dd) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_reviews": 62975,
    "positive_count": 35000,
    "negative_count": 25000,
    "neutral_count": 2975,
    "positive_percentage": 55.6,
    "negative_percentage": 39.7,
    "neutral_percentage": 4.7,
    "avg_confidence_score": 0.78,
    "new_reviews_this_week": 150
  }
}
```

### 2.2. GET `/dashboard/trend` – Biểu đồ trend

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `period` | String | Khoảng thời gian: `7d`, `30d`, `90d`, `custom` |
| `from_date` | String (optional) | Từ ngày (khi period=custom) |
| `to_date` | String (optional) | Đến ngày (khi period=custom) |
| `data_source_id` | Long (optional) | Lọc theo nguồn |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "trend_data": [
      {
        "date": "2026-03-01",
        "positive": 120,
        "negative": 80,
        "neutral": 15,
        "total": 215
      }
    ]
  }
}
```

### 2.3. GET `/reviews/top` – Top positive/negative reviews

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `type` | String | `positive` hoặc `negative` |
| `limit` | Int (default: 10) | Số lượng |
| `sort_by` | String (default: `confidence`) | Sắp xếp: `confidence`, `date` |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "content": "Quán ăn rất ngon, phục vụ tốt...",
      "sentiment": "POSITIVE",
      "confidence_score": 0.95,
      "data_source_name": "Google Reviews Q1",
      "created_at": "2026-03-10T14:30:00"
    }
  ]
}
```

### 2.4. GET `/reviews` – Tìm kiếm và lọc reviews

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `keyword` | String (optional) | Từ khóa tìm kiếm |
| `sentiment` | String (optional) | Lọc: POSITIVE, NEGATIVE, NEUTRAL |
| `data_source_id` | Long (optional) | Lọc theo nguồn |
| `from_date` | String (optional) | Từ ngày |
| `to_date` | String (optional) | Đến ngày |
| `min_confidence` | Float (optional) | Confidence tối thiểu |
| `max_confidence` | Float (optional) | Confidence tối đa |
| `page` | Int (default: 0) | Trang |
| `size` | Int (default: 20) | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "content": "Đồ ăn ngon, giá hợp lý",
        "sentiment": "POSITIVE",
        "confidence_score": 0.85,
        "data_source_name": "CSV Import",
        "status": "NEW",
        "created_at": "2026-03-10T14:30:00"
      }
    ],
    "page": 0,
    "size": 20,
    "total_elements": 62975,
    "total_pages": 3149
  }
}
```

### 2.5. GET `/reports/export` – Export báo cáo

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `format` | String | `pdf` hoặc `excel` |
| `content_type` | String | `summary`, `trend`, `reviews` |
| `from_date` | String (optional) | Từ ngày |
| `to_date` | String (optional) | Đến ngày |

**Response (200):** File download (application/pdf hoặc application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

### 2.6. POST `/reports/custom` – Tạo custom report

**Request:**
```json
{
  "name": "Báo cáo tháng 3",
  "config": {
    "metrics": ["sentiment_distribution", "trend", "top_keywords"],
    "from_date": "2026-03-01",
    "to_date": "2026-03-31",
    "data_source_ids": [1, 2]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Báo cáo tháng 3",
    "created_at": "2026-03-12T10:00:00"
  }
}
```

### 2.7. GET `/reports/custom` – Xem danh sách custom reports

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Báo cáo tháng 3",
      "created_at": "2026-03-12T10:00:00"
    }
  ]
}
```

---

## 3. Manager APIs (Role: MANAGER - 10 endpoints)

### 3.1. GET `/data-sources` – Xem danh sách data sources

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Google Reviews Q1",
      "type": "CSV",
      "description": "Import từ file CSV",
      "review_count": 62975,
      "is_active": true,
      "created_at": "2026-03-01T10:00:00"
    }
  ]
}
```

### 3.2. POST `/data-sources` – Tạo data source mới

**Request:**
```json
{
  "name": "Vietnamese Food Reviews",
  "type": "CSV",
  "description": "Dataset Vietnamese Food Reviews từ Kaggle",
  "business_id": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Vietnamese Food Reviews",
    "type": "CSV",
    "created_at": "2026-03-01T10:00:00"
  }
}
```

### 3.3. PUT `/data-sources/{id}` – Cập nhật data source

**Request:**
```json
{
  "name": "Vietnamese Food Reviews - Updated",
  "description": "Cập nhật mô tả"
}
```

**Response (200):** Trả về data source đã cập nhật

### 3.4. DELETE `/data-sources/{id}` – Xóa data source (soft delete)

**Response (200):**
```json
{
  "success": true,
  "message": "Data source đã được xóa"
}
```

### 3.5. POST `/data-sources/{id}/import` – Import data từ CSV/Excel

**Request:** `multipart/form-data`
| Field | Kiểu | Mô tả |
|-------|------|-------|
| `file` | File | File CSV hoặc Excel |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "imported_count": 62975,
    "failed_count": 0,
    "sentiment_analyzed": 62975,
    "message": "Import thành công. AI đang phân tích sentiment..."
  }
}
```

> **Lưu ý:** Sau khi import, AI tự động phân tích sentiment cho tất cả reviews mới.

### 3.6. PUT `/reviews/{id}/flag` – Đánh dấu review cần xử lý

**Request:**
```json
{
  "priority": "HIGH",
  "note": "Review tiêu cực nghiêm trọng, cần xử lý gấp"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "FLAGGED",
    "priority": "HIGH",
    "flag_note": "Review tiêu cực nghiêm trọng, cần xử lý gấp"
  }
}
```

### 3.7. PUT `/reviews/{id}/assign` – Assign review cho team member

**Request:**
```json
{
  "assigned_to": 5,
  "deadline": "2026-03-15T17:00:00"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "review_id": 123,
    "assigned_to": "Nguyễn Văn B",
    "status": "ASSIGNED",
    "deadline": "2026-03-15T17:00:00"
  }
}
```

### 3.8. GET `/reviews/assignments` – Theo dõi trạng thái xử lý

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `status` | String (optional) | PENDING, IN_PROGRESS, RESOLVED |
| `assigned_to` | Long (optional) | ID người được giao |
| `page` | Int (default: 0) | Trang |
| `size` | Int (default: 20) | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "review_id": 123,
        "review_content": "Đồ ăn dở quá...",
        "assigned_to_name": "Nguyễn Văn B",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "deadline": "2026-03-15T17:00:00",
        "created_at": "2026-03-10T10:00:00"
      }
    ],
    "total_elements": 15
  }
}
```

### 3.9. POST `/alerts` – Tạo alert rule

**Request:**
```json
{
  "condition_type": "NEGATIVE_COUNT",
  "threshold": 5,
  "confidence_threshold": 0.8,
  "channel": "EMAIL"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "condition_type": "NEGATIVE_COUNT",
    "threshold": 5,
    "channel": "EMAIL",
    "is_active": true
  }
}
```

### 3.10. GET `/alerts` – Xem danh sách alerts

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "condition_type": "NEGATIVE_COUNT",
      "threshold": 5,
      "channel": "EMAIL",
      "is_active": true,
      "created_at": "2026-03-10T10:00:00"
    }
  ]
}
```

---

## 4. Admin APIs (Role: ADMIN - 10 endpoints)

### 4.1. GET `/users` – Xem danh sách users

**Query Params:**
| Param | Kiểu | Mô tả |
|-------|------|-------|
| `role` | String (optional) | Lọc theo role |
| `is_active` | Boolean (optional) | Lọc theo trạng thái |
| `page` | Int (default: 0) | Trang |
| `size` | Int (default: 20) | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "email": "analyst@example.com",
        "full_name": "Nguyễn Văn A",
        "roles": ["ANALYST"],
        "is_active": true,
        "created_at": "2026-03-01T10:00:00"
      }
    ],
    "total_elements": 50
  }
}
```

### 4.2. POST `/users` – Tạo user mới

**Request:**
```json
{
  "email": "manager@example.com",
  "password": "password123",
  "full_name": "Trần Thị B",
  "roles": ["MANAGER"]
}
```

**Response (201):** Trả về user đã tạo

### 4.3. PUT `/users/{id}` – Cập nhật user

**Request:**
```json
{
  "full_name": "Trần Thị B (updated)",
  "roles": ["MANAGER", "ANALYST"],
  "is_active": true
}
```

**Response (200):** Trả về user đã cập nhật

### 4.4. DELETE `/users/{id}` – Vô hiệu hóa user (soft delete)

**Response (200):**
```json
{
  "success": true,
  "message": "User đã bị vô hiệu hóa"
}
```

### 4.5. CRUD `/businesses` – Quản lý doanh nghiệp

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/businesses` | Xem danh sách |
| POST | `/businesses` | Tạo mới |
| PUT | `/businesses/{id}` | Cập nhật |
| DELETE | `/businesses/{id}` | Xóa (soft delete) |

**POST Request:**
```json
{
  "name": "Quán Ăn ABC",
  "description": "Nhà hàng Việt Nam tại TP.HCM",
  "logo_url": "https://example.com/logo.png"
}
```

### 4.6. PUT `/config/ai` – Cấu hình AI model

**Request:**
```json
{
  "api_key": "sk-...",
  "model": "gpt-3.5-turbo",
  "temperature": 0.3,
  "max_tokens": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "model": "gpt-3.5-turbo",
    "status": "CONNECTED",
    "last_tested": "2026-03-12T10:00:00"
  }
}
```

### 4.7. GET `/config/ai/usage` – Xem thống kê AI API usage

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_requests": 62975,
    "total_tokens_used": 1250000,
    "avg_response_time_ms": 450,
    "error_rate": 0.01
  }
}
```

### 4.8. CRUD `/keywords` – Quản lý keywords tracking

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/keywords` | Xem danh sách keywords |
| POST | `/keywords` | Thêm keyword mới |
| PUT | `/keywords/{id}` | Cập nhật keyword |
| DELETE | `/keywords/{id}` | Xóa keyword |

**POST Request:**
```json
{
  "keyword": "ngon",
  "category": "FOOD_QUALITY"
}
```

### 4.9. GET `/reports/system` – Báo cáo hệ thống

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_users": 50,
    "total_reviews": 62975,
    "total_data_sources": 5,
    "api_usage": {
      "total_requests": 62975,
      "total_tokens": 1250000
    },
    "storage_used_mb": 150,
    "activity_chart": [
      {
        "date": "2026-03-01",
        "new_reviews": 200,
        "ai_requests": 200,
        "active_users": 15
      }
    ]
  }
}
```

### 4.10. CRUD `/notifications` – Quản lý thông báo

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/notifications` | Xem danh sách thông báo đã gửi |
| POST | `/notifications` | Tạo thông báo mới |
| GET | `/notifications/{id}` | Xem chi tiết |
| DELETE | `/notifications/{id}` | Xóa thông báo |

**POST Request (tạo thông báo):**
```json
{
  "title": "Bảo trì hệ thống",
  "content": "Hệ thống sẽ bảo trì từ 22h-23h ngày 15/03/2026",
  "target_role": "ALL",
  "scheduled_at": "2026-03-14T22:00:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Bảo trì hệ thống",
    "target_role": "ALL",
    "scheduled_at": "2026-03-14T22:00:00",
    "created_at": "2026-03-12T10:00:00"
  }
}
```

---

## 5. Tổng Kết Endpoints

| Nhóm | Số endpoints | Chi tiết |
|------|-------------|----------|
| Authentication | 3 | register, login, me |
| Analyst | 7 | dashboard summary, trend, top reviews, search/filter, export, custom reports (CRUD) |
| Manager | 10 | data sources (CRUD), import, flag, assign, assignments, alerts (CRUD) |
| Admin | 10 | users (CRUD), businesses (CRUD), AI config, AI usage, keywords (CRUD), system reports, notifications (CRUD) |
| **Tổng** | **30** | Vượt yêu cầu 20-30 endpoints ✅ |

---

## 6. HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (chưa đăng nhập) |
| 403 | Forbidden (không có quyền) |
| 404 | Not Found |
| 500 | Internal Server Error |
