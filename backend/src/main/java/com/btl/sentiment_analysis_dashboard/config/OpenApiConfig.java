package com.btl.sentiment_analysis_dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components; // Đúng tên class là Components (không phải Compoments)
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {
        @Bean
        public OpenAPI openAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("Sentiment Analysis Dashboard API")
                                                .description(
                                                                "API cho hệ thống phân tích cảm xúc: auth, User CRUD, phân quyền, review management")
                                                .version("1.0"))
                                .components(new Components() // Sửa lỗi: compoments → components, Compoments →
                                                             // Components
                                                .addSecuritySchemes("bearerToken", new SecurityScheme()
                                                                .type(SecurityScheme.Type.HTTP) // Sửa lỗi:
                                                                                                // SecuritySchemeType.HTTP
                                                                                                // →
                                                                                                // SecurityScheme.Type.HTTP
                                                                .scheme("bearer")
                                                                .bearerFormat("JWT")
                                                                .description("Nhập access token sau khi đăng nhập")));
        }
}