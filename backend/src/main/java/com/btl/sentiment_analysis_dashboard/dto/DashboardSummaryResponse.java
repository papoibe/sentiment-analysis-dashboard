package com.btl.sentiment_analysis_dashboard.dto;

import java.time.LocalDateTime;

// DTO Dashboard Summary - tong quan sentiment cho Analyst
public record DashboardSummaryResponse(
        long totalReviews,
        long positiveCount,
        long negativeCount,
        long neutralCount,
        double positivePercentage,
        double negativePercentage,
        double neutralPercentage,
        double avgConfidenceScore,
        long newReviewsThisWeek) {
}
