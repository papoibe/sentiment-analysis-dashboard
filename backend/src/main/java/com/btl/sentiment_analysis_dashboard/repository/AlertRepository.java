package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    // Tim tat ca alerts cua 1 user
    List<Alert> findByUserId(Long userId);

    // Tim tat ca alerts dang hoat dong
    List<Alert> findByIsActiveTrue();
}
