package com.btl.sentiment_analysis_dashboard.dto;

/**
 * Response trả về sau khi đăng nhập thành công - chứa JWT token
 */
public record AuthResponse(
        String accessToken, // JWT access token dùng để xác thực các request
        String tokenType, // Loại token (luôn là "Bearer")
        long expiresIn, // Thời gian hết hạn (milliseconds)
        UserResponse user // Thông tin user đã đăng nhập
) {
}
