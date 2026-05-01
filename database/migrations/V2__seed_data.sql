-- =============================================
-- Seed Data — Dữ liệu mẫu để demo
-- Chạy sau V1__init_schema.sql
-- =============================================

-- Tài khoản mặc định (password: password123, đã hash bằng BCrypt)
-- DataSeeder.java đã tạo sẵn 3 users khi app khởi động
-- File này để tham khảo cấu trúc dữ liệu

-- Businesses
INSERT INTO businesses (name, description, is_active) VALUES
('Phở Việt - Quận 1', 'Quán phở truyền thống Sài Gòn', TRUE),
('Cafe Saigon - Quận 3', 'Quán cafe hiện đại phong cách Sài Gòn', TRUE);

-- Data Sources
INSERT INTO data_sources (name, type, description, created_by, business_id, is_active) VALUES
('Google Reviews - Phở Việt', 'GOOGLE', 'Reviews từ Google Maps', 1, 1, TRUE),
('Facebook Reviews - Cafe Saigon', 'FACEBOOK', 'Reviews từ Facebook Page', 1, 2, TRUE),
('CSV Import Q1 2026', 'CSV', 'Dữ liệu import từ file CSV', 1, 1, TRUE);

-- Keywords tracking
INSERT INTO keywords (keyword, category, is_active) VALUES
('ngon', 'FOOD_QUALITY', TRUE),
('dở', 'FOOD_QUALITY', TRUE),
('phục vụ tốt', 'SERVICE', TRUE),
('chậm', 'SERVICE', TRUE),
('sạch sẽ', 'ATMOSPHERE', TRUE),
('giá rẻ', 'PRICE', TRUE),
('đắt', 'PRICE', TRUE);
