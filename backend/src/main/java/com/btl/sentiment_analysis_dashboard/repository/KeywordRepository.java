package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KeywordRepository extends JpaRepository<Keyword, Long> {
    // Tim tat ca tu khoa dang duoc tracking
    List<Keyword> findByIsActiveTrue();
}
