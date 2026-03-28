package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.ApiResponse;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Controller cho Manager - Alerts APIs (2 endpoints)
@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    // POST /alerts - Tao alert rule moi
    @PostMapping
    public ResponseEntity<ApiResponse<Alert>> createAlert(@RequestBody Alert alert) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(alertRepository.save(alert)));
    }

    // GET /alerts - Xem danh sach alerts
    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.success(alertRepository.findAll()));
    }
}
