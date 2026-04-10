package com.btl.sentiment_analysis_dashboard.dto;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude; // Jackson annotations vẫn giữ package com.fasterxml (kể cả Jackson 2.20+)

// Format lỗi thống nhất cho toàn bộ API
@JsonInclude(JsonInclude.Include.NON_NULL) // Không trả về các field null trong JSON
public record ApiError(
        String error,
        String message,
        List<FieldErrorDetail> details,
        String path,
        Instant timestamp) {
    public record FieldErrorDetail(String field, String message) {
        
    } // Chi tiết lỗi cho từng field khi validation fail
}