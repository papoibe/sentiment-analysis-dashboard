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

    // PUT /alerts/{id} - Cap nhat alert rule
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Alert>> updateAlert(@PathVariable Long id, @RequestBody Alert updated) {
        Alert existing = alertRepository.findById(id)
                .orElseThrow(() -> new com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException("Alert không tồn tại"));
        if (updated.getConditionType() != null) existing.setConditionType(updated.getConditionType());
        if (updated.getThreshold() != null) existing.setThreshold(updated.getThreshold());
        if (updated.getConfidenceThreshold() != null) existing.setConfidenceThreshold(updated.getConfidenceThreshold());
        if (updated.getChannel() != null) existing.setChannel(updated.getChannel());
        if (updated.getIsActive() != null) existing.setIsActive(updated.getIsActive());
        return ResponseEntity.ok(ApiResponse.success(alertRepository.save(existing)));
    }

    // DELETE /alerts/{id} - Xoa alert rule
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAlert(@PathVariable Long id) {
        if (!alertRepository.existsById(id)) {
            throw new com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException("Alert không tồn tại");
        }
        alertRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa alert #" + id));
    }
}
