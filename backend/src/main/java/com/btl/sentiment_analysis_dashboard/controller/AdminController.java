package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import com.btl.sentiment_analysis_dashboard.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Controller cho Admin - Business CRUD (4 endpoints), Keyword CRUD (4 endpoints),
// AI Config (2 endpoints), System Report (1 endpoint), Notification CRUD (4 endpoints)
// Tong: 15 endpoints
@RestController
@RequestMapping("/api/v1")
public class AdminController {

    private final BusinessRepository businessRepository;
    private final KeywordRepository keywordRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final DataSourceRepository dataSourceRepository;
    private final SentimentResultRepository sentimentResultRepository;

    public AdminController(BusinessRepository businessRepository,
            KeywordRepository keywordRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            DataSourceRepository dataSourceRepository,
            SentimentResultRepository sentimentResultRepository) {
        this.businessRepository = businessRepository;
        this.keywordRepository = keywordRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.dataSourceRepository = dataSourceRepository;
        this.sentimentResultRepository = sentimentResultRepository;
    }

    // === BUSINESS CRUD (4 endpoints) ===

    @GetMapping("/businesses")
    public ResponseEntity<ApiResponse<List<Business>>> getAllBusinesses() {
        return ResponseEntity.ok(ApiResponse.success(businessRepository.findAll()));
    }

    @PostMapping("/businesses")
    public ResponseEntity<ApiResponse<Business>> createBusiness(@RequestBody Business business) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(businessRepository.save(business)));
    }

    @PutMapping("/businesses/{id}")
    public ResponseEntity<ApiResponse<Business>> updateBusiness(@PathVariable Long id,
            @RequestBody Business updated) {
        Business existing = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business không tồn tại"));
        if (updated.getName() != null)
            existing.setName(updated.getName());
        if (updated.getDescription() != null)
            existing.setDescription(updated.getDescription());
        if (updated.getLogoUrl() != null)
            existing.setLogoUrl(updated.getLogoUrl());
        return ResponseEntity.ok(ApiResponse.success(businessRepository.save(existing)));
    }

    @DeleteMapping("/businesses/{id}")
    public ResponseEntity<ApiResponse<String>> deleteBusiness(@PathVariable Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business không tồn tại"));
        business.setIsActive(false); // Soft delete
        businessRepository.save(business);
        return ResponseEntity.ok(ApiResponse.success("Business đã được xóa"));
    }

    // === KEYWORD CRUD (4 endpoints) ===

    @GetMapping("/keywords")
    public ResponseEntity<ApiResponse<List<Keyword>>> getAllKeywords() {
        return ResponseEntity.ok(ApiResponse.success(keywordRepository.findAll()));
    }

    @PostMapping("/keywords")
    public ResponseEntity<ApiResponse<Keyword>> createKeyword(@RequestBody Keyword keyword) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(keywordRepository.save(keyword)));
    }

    @PutMapping("/keywords/{id}")
    public ResponseEntity<ApiResponse<Keyword>> updateKeyword(@PathVariable Long id,
            @RequestBody Keyword updated) {
        Keyword existing = keywordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Keyword không tồn tại"));
        if (updated.getKeyword() != null)
            existing.setKeyword(updated.getKeyword());
        if (updated.getCategory() != null)
            existing.setCategory(updated.getCategory());
        if (updated.getIsActive() != null)
            existing.setIsActive(updated.getIsActive());
        return ResponseEntity.ok(ApiResponse.success(keywordRepository.save(existing)));
    }

    @DeleteMapping("/keywords/{id}")
    public ResponseEntity<ApiResponse<String>> deleteKeyword(@PathVariable Long id) {
        keywordRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Keyword đã được xóa"));
    }

    // === AI CONFIG (2 endpoints) ===

    // PUT /config/ai - Cau hinh AI model (mock - chi luu vao memory)
    @PutMapping("/config/ai")
    public ResponseEntity<ApiResponse<Map<String, Object>>> configureAi(
            @RequestBody Map<String, Object> config) {
        Map<String, Object> result = new HashMap<>();
        result.put("model", config.getOrDefault("model", "mock-sentiment-v1"));
        result.put("status", "CONNECTED");
        result.put("last_tested", java.time.LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // GET /config/ai/usage - Thong ke AI API usage
    @GetMapping("/config/ai/usage")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiUsage() {
        long totalAnalyzed = sentimentResultRepository.count();
        Map<String, Object> usage = new HashMap<>();
        usage.put("total_requests", totalAnalyzed);
        usage.put("total_tokens_used", totalAnalyzed * 20); // Uoc tinh
        usage.put("avg_response_time_ms", 50); // Mock nen rat nhanh
        usage.put("error_rate", 0.0);
        return ResponseEntity.ok(ApiResponse.success(usage));
    }

    // === SYSTEM REPORT (1 endpoint) ===

    // GET /reports/system - Bao cao he thong
    @GetMapping("/reports/system")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemReport() {
        Map<String, Object> report = new HashMap<>();
        report.put("total_users", userRepository.count());
        report.put("total_reviews", reviewRepository.count());
        report.put("total_data_sources", dataSourceRepository.count());
        report.put("total_sentiment_analyzed", sentimentResultRepository.count());

        Map<String, Object> apiUsage = new HashMap<>();
        apiUsage.put("total_requests", sentimentResultRepository.count());
        apiUsage.put("total_tokens", sentimentResultRepository.count() * 20);
        report.put("api_usage", apiUsage);

        return ResponseEntity.ok(ApiResponse.success(report));
    }

    // === NOTIFICATION CRUD (4 endpoints) ===

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getAllNotifications() {
        return ResponseEntity.ok(ApiResponse.success(notificationRepository.findAll()));
    }

    @PostMapping("/notifications")
    public ResponseEntity<ApiResponse<Notification>> createNotification(
            @RequestBody Notification notification) {
        notification.setSentAt(java.time.LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(notificationRepository.save(notification)));
    }

    @GetMapping("/notifications/{id}")
    public ResponseEntity<ApiResponse<Notification>> getNotification(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification không tồn tại"));
        return ResponseEntity.ok(ApiResponse.success(notification));
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Notification đã được xóa"));
    }
}
