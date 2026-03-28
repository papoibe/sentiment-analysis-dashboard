package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

// Controller cho Analyst - Dashboard APIs (2 endpoints)
@RestController
@RequestMapping("/api/v1")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // GET /dashboard/summary - Dashboard tong quan sentiment
    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @RequestParam(required = false) Long dataSourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        DashboardSummaryResponse summary = dashboardService.getSummary(dataSourceId, fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // GET /dashboard/trend - Bieu do trend theo thoi gian
    @GetMapping("/dashboard/trend")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrend(
            @RequestParam(defaultValue = "30d") String period,
            @RequestParam(required = false) Long dataSourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        var trendData = dashboardService.getTrend(period, dataSourceId, fromDate, toDate);
        Map<String, Object> data = new HashMap<>();
        data.put("period", period);
        data.put("trend_data", trendData);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
