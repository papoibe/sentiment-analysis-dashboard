package com.btl.sentiment_analysis_dashboard.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Username hoặc Email không được để trống") String usernameOrEmail,

        @NotBlank(message = "Username hoặc Email không được để trống") String password) {
}