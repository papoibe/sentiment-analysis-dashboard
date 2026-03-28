package com.btl.sentiment_analysis_dashboard.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt") // Bind các giá trị từ application.yaml có prefix "app.jwt"
public class JwtProperties {

    private String secret = "defaultSecMustBeLongEnoughForHS256"; // Khóa bí mật, tối thiểu 256 bit
    private Long accessTokenExpirationMs = 900_000L; // 15 phút
    private Long refreshTokenExpirationMs = 604_800_000L; // 7 ngày

    // Getter/Setter cần thiết để Spring Boot bind giá trị từ config
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }

    public void setAccessTokenExpirationMs(Long accessTokenExpirationMs) {
        this.accessTokenExpirationMs = accessTokenExpirationMs;
    }

    public Long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

    public void setRefreshTokenExpirationMs(Long refreshTokenExpirationMs) {
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

}
