package com.btl.sentiment_analysis_dashboard.dto;

public record AuthReponse(

        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresInSeconds,
        UserResponse user // Sửa UserReponse → UserResponse (đúng tên class)
) {
    public AuthReponse {
        if (tokenType == null || tokenType.isBlank()) {
            tokenType = "Bearer";
        }
    }

    public static AuthReponse of(
            String accessToken,
            String refreshToken,
            Long expiresInSeconds,
            UserResponse user, // Sửa UserReponse → UserResponse
            String tokenType) {
        return new AuthReponse(accessToken, refreshToken, "Bearer", expiresInSeconds, user);
    }

}
