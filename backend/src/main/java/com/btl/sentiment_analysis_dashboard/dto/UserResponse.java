package com.btl.sentiment_analysis_dashboard.dto;

import java.time.Instant;
import com.btl.sentiment_analysis_dashboard.entity.Role; // Role là enum riêng, không phải inner class của User

public record UserResponse(
        Long id,
        String username,
        String email,
        Role role,
        String fullName,
        Instant createdAt,
        Instant updatedAt) {
}