package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import com.btl.sentiment_analysis_dashboard.service.DataSourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

// Controller cho Manager - Data Source APIs (5 endpoints)
@RestController
@RequestMapping("/api/v1/data-sources")
public class DataSourceController {

    private final DataSourceService dataSourceService;

    public DataSourceController(DataSourceService dataSourceService) {
        this.dataSourceService = dataSourceService;
    }

    // GET /data-sources - Xem danh sach data sources
    @GetMapping
    public ResponseEntity<ApiResponse<List<DataSource>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(dataSourceService.findAll()));
    }

    // POST /data-sources - Tao data source moi
    @PostMapping
    public ResponseEntity<ApiResponse<DataSource>> create(@RequestBody DataSource dataSource) {
        DataSource created = dataSourceService.create(dataSource);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    // PUT /data-sources/{id} - Cap nhat data source
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DataSource>> update(@PathVariable Long id,
            @RequestBody DataSource dataSource) {
        return ResponseEntity.ok(ApiResponse.success(dataSourceService.update(id, dataSource)));
    }

    // DELETE /data-sources/{id} - Xoa data source (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        dataSourceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Data source đã được xóa"));
    }

    // POST /data-sources/{id}/import - Import data tu CSV
    @PostMapping("/{id}/import")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importCsv(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        Map<String, Object> result = dataSourceService.importCsv(id, file);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
