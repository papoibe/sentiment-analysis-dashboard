-- =============================================
-- Sentiment Analysis Dashboard — Database Schema
-- Tạo từ JPA Entities (10 bảng)
-- Database: H2 (dev) / PostgreSQL (production)
-- =============================================

-- 1. Bảng users — Người dùng hệ thống (ANALYST, MANAGER, ADMIN)
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password_hash   VARCHAR(225)    NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    full_name       VARCHAR(100),
    role            VARCHAR(20)     NOT NULL DEFAULT 'ANALYST',  -- ANALYST | MANAGER | ADMIN
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Bảng businesses — Doanh nghiệp sử dụng hệ thống
CREATE TABLE IF NOT EXISTS businesses (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    description     TEXT,
    logo_url        VARCHAR(500),
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng data_sources — Nguồn dữ liệu reviews (CSV, Google, Facebook)
CREATE TABLE IF NOT EXISTS data_sources (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,                    -- CSV | EXCEL | GOOGLE | FACEBOOK
    description     TEXT,
    created_by      BIGINT          REFERENCES users(id),
    business_id     BIGINT          REFERENCES businesses(id),
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng reviews — Nội dung review từ khách hàng
CREATE TABLE IF NOT EXISTS reviews (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    content         TEXT            NOT NULL,
    source_type     VARCHAR(50),                                 -- GOOGLE | FACEBOOK | CSV
    data_source_id  BIGINT          REFERENCES data_sources(id),
    status          VARCHAR(30)     DEFAULT 'NEW',               -- NEW | FLAGGED | ASSIGNED | IN_PROGRESS | RESOLVED
    priority        VARCHAR(20),                                 -- HIGH | MEDIUM | LOW
    assigned_to     BIGINT          REFERENCES users(id),
    flag_note       TEXT,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng sentiment_results — Kết quả phân tích AI (1-1 với review)
CREATE TABLE IF NOT EXISTS sentiment_results (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    review_id       BIGINT          UNIQUE REFERENCES reviews(id),
    sentiment       VARCHAR(20)     NOT NULL,                    -- POSITIVE | NEGATIVE | NEUTRAL
    confidence_score DOUBLE         NOT NULL,                    -- 0.0 → 1.0
    raw_response    TEXT,                                        -- JSON response gốc từ OpenAI
    analyzed_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 6. Bảng keywords — Từ khóa tracking
CREATE TABLE IF NOT EXISTS keywords (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    keyword         VARCHAR(100)    NOT NULL,
    category        VARCHAR(50),                                 -- FOOD_QUALITY | SERVICE | PRICE | ATMOSPHERE
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng review_keywords — Liên kết nhiều-nhiều Review ↔ Keyword
CREATE TABLE IF NOT EXISTS review_keywords (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    review_id       BIGINT          REFERENCES reviews(id),
    keyword_id      BIGINT          REFERENCES keywords(id),
    frequency       INT             DEFAULT 1                    -- Số lần từ khóa xuất hiện trong review
);

-- 8. Bảng review_assignments — Giao review cho team member xử lý
CREATE TABLE IF NOT EXISTS review_assignments (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    review_id       BIGINT          REFERENCES reviews(id),
    assigned_to     BIGINT          REFERENCES users(id),
    assigned_by     BIGINT          REFERENCES users(id),
    status          VARCHAR(30)     DEFAULT 'PENDING',           -- PENDING | IN_PROGRESS | RESOLVED
    deadline        TIMESTAMP,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP
);

-- 9. Bảng alerts — Cấu hình cảnh báo tự động
CREATE TABLE IF NOT EXISTS alerts (
    id                      BIGINT      AUTO_INCREMENT PRIMARY KEY,
    user_id                 BIGINT      REFERENCES users(id),
    condition_type          VARCHAR(50) NOT NULL,                 -- NEGATIVE_COUNT | LOW_CONFIDENCE
    threshold               INT         NOT NULL,
    confidence_threshold    DOUBLE,
    channel                 VARCHAR(30) NOT NULL,                 -- EMAIL | IN_APP
    is_active               BOOLEAN     DEFAULT TRUE,
    created_at              TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- 10. Bảng notifications — Thông báo hệ thống
CREATE TABLE IF NOT EXISTS notifications (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200)    NOT NULL,
    content         TEXT            NOT NULL,
    sender_id       BIGINT          REFERENCES users(id),
    target_role     VARCHAR(50),                                 -- ALL | ANALYST | MANAGER
    is_read         BOOLEAN         DEFAULT FALSE,
    scheduled_at    TIMESTAMP,
    sent_at         TIMESTAMP,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- 11. Bảng custom_reports — Báo cáo tùy chỉnh do Analyst tạo
CREATE TABLE IF NOT EXISTS custom_reports (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    created_by      BIGINT          REFERENCES users(id),
    config_json     TEXT            NOT NULL,                    -- JSON: metrics, time range, sources
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);
