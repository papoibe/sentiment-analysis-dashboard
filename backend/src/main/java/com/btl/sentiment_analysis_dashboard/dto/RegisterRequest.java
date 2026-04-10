package com.btl.sentiment_analysis_dashboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username không được để trống") @Size(min = 3, max = 50) String username,

        @NotBlank(message = "email không được để trống") @Size(min = 3, max = 50) String email,

        @NotBlank(message = "Password không được để trống") @Size(min = 8, message = "Password phải có ít nhất 8 ký tự") String password) {

}
