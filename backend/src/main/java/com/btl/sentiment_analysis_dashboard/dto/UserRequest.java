package com.btl.sentiment_analysis_dashboard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO request tao/cap nhat user - Admin dung de CRUD users
public record UserRequest(
        @NotBlank(message = "Username không được để trống") @Size(min = 3, max = 50) String username,

        @NotBlank(message = "Email không được để trống") @Email(message = "Email không hợp lệ") String email,

        @Size(min = 8, message = "Password tối thiểu 8 ký tự") String password,

        String fullName, // Ten day du

        String role // ANALYST, MANAGER, ADMIN
) {
}