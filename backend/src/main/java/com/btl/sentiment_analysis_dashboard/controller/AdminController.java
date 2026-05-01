package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.config.OpenAiProperties;
import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import com.btl.sentiment_analysis_dashboard.repository.*;
import com.btl.sentiment_analysis_dashboard.service.NotificationService;
import com.btl.sentiment_analysis_dashboard.service.SentimentServiceRouter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Controller cho Admin - Business CRUD (4 endpoints), Keyword CRUD (4 endpoints),
// AI Config (2 endpoints), System Report (1 endpoint), Notification (7 endpoints)
// Tong: 18 endpoints
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
    private final SentimentServiceRouter sentimentRouter; // Router AI mode
    private final OpenAiProperties openAiProperties;

    public AdminController(BusinessRepository businessRepository,
            KeywordRepository keywordRepository,
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            DataSourceRepository dataSourceRepository,
            SentimentResultRepository sentimentResultRepository,
            SentimentServiceRouter sentimentRouter,
            OpenAiProperties openAiProperties,
            NotificationService notificationService) {
        this.businessRepository = businessRepository;
        this.keywordRepository = keywordRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.dataSourceRepository = dataSourceRepository;
        this.sentimentResultRepository = sentimentResultRepository;
        this.sentimentRouter = sentimentRouter;
        this.openAiProperties = openAiProperties;
        this.notificationService = notificationService;
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

    // PUT /config/ai - Xem cau hinh AI model hien tai (OpenAI hoac Mock)
    @PutMapping("/config/ai")
    public ResponseEntity<ApiResponse<Map<String, Object>>> configureAi(
            @RequestBody Map<String, Object> config) {
        Map<String, Object> result = new HashMap<>();
        result.put("mode", sentimentRouter.getCurrentMode()); // OPENAI_CONNECTED hoac MOCK_MODE
        result.put("model", sentimentRouter.getCurrentModel());
        result.put("base_url", openAiProperties.getBaseUrl());
        result.put("openai_enabled", openAiProperties.isEnabled());
        result.put("status", openAiProperties.isEnabled() ? "CONNECTED" : "MOCK");
        result.put("last_tested", java.time.LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // GET /config/ai/usage - Thong ke AI API usage
    @GetMapping("/config/ai/usage")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiUsage() {
        long totalAnalyzed = sentimentResultRepository.count();
        Map<String, Object> usage = new HashMap<>();
        usage.put("mode", sentimentRouter.getCurrentMode());
        usage.put("model", sentimentRouter.getCurrentModel());
        usage.put("total_requests", totalAnalyzed);
        usage.put("total_tokens_used", totalAnalyzed * 20); // Uoc tinh
        usage.put("avg_response_time_ms", openAiProperties.isEnabled() ? 1500 : 50);
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

    // === NOTIFICATION ENDPOINTS (7 endpoints) ===

    private final NotificationService notificationService;

    // GET /notifications — lay thong bao theo role cua user dang dang nhap
    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @RequestParam(required = false) String role) {
        // Neu khong truyen role, tra tat ca
        String targetRole = (role != null) ? role : "ALL";
        List<Notification> notifications = notificationService.getForRole(targetRole);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    // GET /notifications/unread-count — dem so thong bao chua doc
    @GetMapping("/notifications/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUnreadCount(
            @RequestParam(required = false, defaultValue = "ALL") String role) {
        long count = notificationService.countUnread(role);
        Map<String, Object> result = new HashMap<>();
        result.put("unread_count", count);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // POST /notifications — tao thong bao moi (Admin gui)
    @PostMapping("/notifications")
    public ResponseEntity<ApiResponse<Notification>> createNotification(
            @RequestBody Notification notification) {
        Notification created = notificationService.create(
                notification.getTitle(),
                notification.getType(),
                notification.getTargetRole() != null ? notification.getTargetRole() : "ALL");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created));
    }

    // GET /notifications/{id} — xem chi tiet 1 thong bao
    @GetMapping("/notifications/{id}")
    public ResponseEntity<ApiResponse<Notification>> getNotification(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification không tồn tại"));
        return ResponseEntity.ok(ApiResponse.success(notification));
    }

    // PUT /notifications/{id}/read — danh dau 1 thong bao da doc
    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu đã đọc"));
    }

    // PUT /notifications/read-all — danh dau tat ca thong bao da doc
    @PutMapping("/notifications/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(
            @RequestParam(required = false, defaultValue = "ALL") String role) {
        notificationService.markAllAsRead(role);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu tất cả đã đọc"));
    }

    // DELETE /notifications/{id}
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Notification đã được xóa"));
    }
}
