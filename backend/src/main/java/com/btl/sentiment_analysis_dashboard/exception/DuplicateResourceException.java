package com.btl.sentiment_analysis_dashboard.exception;

// Exception cho trường hợp trùng lặp dữ liệu (username, email đã tồn tại)
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
