package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusinessRepository extends JpaRepository<Business, Long> {
    // Tim tat ca doanh nghiep dang hoat dong
    List<Business> findByIsActiveTrue();
}
