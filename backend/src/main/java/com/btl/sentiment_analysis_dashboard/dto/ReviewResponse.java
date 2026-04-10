package com.btl.sentiment_analysis_dashboard.dto;

import java.time.LocalDateTime;

// DTO Review Response - thong tin review tra ve cho client
public record ReviewResponse(
        Long id,
        String content,
        String sentiment,
        Double confidenceScore,
        String dataSourceName,
        String status,
        String priority,
        LocalDateTime createdAt) {
}
