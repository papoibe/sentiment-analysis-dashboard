package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.CustomReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomReportRepository extends JpaRepository<CustomReport, Long> {
    // Tim tat ca bao cao cua 1 analyst
    List<CustomReport> findByCreatedById(Long userId);
}
