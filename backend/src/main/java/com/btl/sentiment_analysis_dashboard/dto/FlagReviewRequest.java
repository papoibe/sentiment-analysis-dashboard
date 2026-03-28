package com.btl.sentiment_analysis_dashboard.dto;

// DTO Flag Review Request - Manager danh dau review can xu ly
public record FlagReviewRequest(
        String priority, // HIGH, MEDIUM, LOW
        String note // Ghi chu ly do
) {
}
