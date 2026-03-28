package com.btl.sentiment_analysis_dashboard.dto;

import java.time.LocalDate;

// DTO Trend Data - du lieu bieu do trend theo thoi gian
public record TrendDataPoint(
        LocalDate date,
        long positive,
        long negative,
        long neutral,
        long total) {
}
