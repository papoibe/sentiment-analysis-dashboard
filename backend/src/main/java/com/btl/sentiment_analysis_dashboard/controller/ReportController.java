package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.ApiResponse;
import com.btl.sentiment_analysis_dashboard.dto.DashboardSummaryResponse;
import com.btl.sentiment_analysis_dashboard.dto.ReviewResponse;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import com.btl.sentiment_analysis_dashboard.service.DashboardService;
import com.btl.sentiment_analysis_dashboard.service.ExportService;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

// Controller cho Analyst - Custom Reports (3 endpoints) + Export (Excel/PDF/JSON)
@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final CustomReportRepository customReportRepository;
    private final SentimentResultRepository sentimentResultRepository;
    private final ReviewRepository reviewRepository;
    private final ExportService exportService;
    private final DashboardService dashboardService;

    public ReportController(CustomReportRepository customReportRepository,
            SentimentResultRepository sentimentResultRepository,
            ReviewRepository reviewRepository,
            ExportService exportService,
            DashboardService dashboardService) {
        this.customReportRepository = customReportRepository;
        this.sentimentResultRepository = sentimentResultRepository;
        this.reviewRepository = reviewRepository;
        this.exportService = exportService;
        this.dashboardService = dashboardService;
    }

    // POST /reports/custom - Tao custom report
    @PostMapping("/custom")
    public ResponseEntity<ApiResponse<CustomReport>> createCustomReport(
            @RequestBody CustomReport report) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(customReportRepository.save(report)));
    }

    // GET /reports/custom - Danh sach custom reports
    @GetMapping("/custom")
    public ResponseEntity<ApiResponse<List<CustomReport>>> getCustomReports() {
        return ResponseEntity.ok(ApiResponse.success(customReportRepository.findAll()));
    }

    // GET /reports/custom/{id} - Chi tiet 1 custom report
    @GetMapping("/custom/{id}")
    public ResponseEntity<ApiResponse<CustomReport>> getCustomReport(@PathVariable Long id) {
        CustomReport report = customReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Custom report không tồn tại"));
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    // GET /reports/export - Export du lieu reviews (Excel, PDF, hoac JSON)
    // Params: format (excel/pdf/json), dataSourceId, fromDate, toDate
    @GetMapping("/export")
    public ResponseEntity<?> exportReport(
            @RequestParam(defaultValue = "json") String format,
            @RequestParam(required = false) Long dataSourceId,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate) throws IOException {

        // Lay tat ca reviews va map sang ReviewResponse (co sentiment)
        List<ReviewResponse> reviews = buildReviewResponses(dataSourceId, fromDate, toDate);

        // Lay dashboard summary de ghi vao bao cao
        DashboardSummaryResponse summary = dashboardService.getSummary(dataSourceId, fromDate, toDate);

        // Xuat theo format yeu cau
        return switch (format.toLowerCase()) {
            case "excel" -> {
                // Tao file .xlsx va tra ve dang download
                byte[] excelBytes = exportService.exportExcel(reviews, summary);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                headers.setContentDispositionFormData("attachment", "sentiment-report.xlsx");
                headers.setContentLength(excelBytes.length);
                yield new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
            }
            case "pdf" -> {
                // Tao file .pdf va tra ve dang download
                byte[] pdfBytes = exportService.exportPdf(reviews, summary);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "sentiment-report.pdf");
                headers.setContentLength(pdfBytes.length);
                yield new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            }
            default -> {
                // Mac dinh tra JSON
                Map<String, Object> exportData = new HashMap<>();
                exportData.put("format", "json");
                exportData.put("total_records", reviews.size());
                exportData.put("summary", summary);
                exportData.put("data", reviews);
                exportData.put("exported_at", java.time.LocalDateTime.now());
                yield ResponseEntity.ok(ApiResponse.success(exportData));
            }
        };
    }

    // Helper: lay reviews va map sang ReviewResponse (co sentiment info)
    // Ho tro loc theo dataSourceId va khoang thoi gian
    private List<ReviewResponse> buildReviewResponses(Long dataSourceId,
            LocalDate fromDate, LocalDate toDate) {
        List<Review> reviews = reviewRepository.findAll();

        // Loc theo data source
        if (dataSourceId != null) {
            reviews = reviews.stream()
                    .filter(r -> r.getDataSource() != null && r.getDataSource().getId().equals(dataSourceId))
                    .collect(Collectors.toList());
        }

        // Loc theo khoang thoi gian
        if (fromDate != null && toDate != null) {
            var from = fromDate.atStartOfDay();
            var to = toDate.plusDays(1).atStartOfDay();
            reviews = reviews.stream()
                    .filter(r -> r.getCreatedAt() != null
                            && !r.getCreatedAt().isBefore(from)
                            && r.getCreatedAt().isBefore(to))
                    .collect(Collectors.toList());
        }

        // Map Review -> ReviewResponse (kem thong tin sentiment)
        return reviews.stream().map(r -> {
            var sr = sentimentResultRepository.findByReviewId(r.getId());
            return new ReviewResponse(
                    r.getId(), r.getContent(),
                    sr.map(SentimentResult::getSentiment).orElse(null),
                    sr.map(SentimentResult::getConfidenceScore).orElse(null),
                    r.getDataSource() != null ? r.getDataSource().getName() : null,
                    r.getStatus(), r.getPriority(), r.getCreatedAt());
        }).collect(Collectors.toList());
    }
}
