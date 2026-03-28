package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.SentimentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SentimentResultRepository extends JpaRepository<SentimentResult, Long> {
    // Tim ket qua sentiment theo review id (quan he 1-1)
    Optional<SentimentResult> findByReviewId(Long reviewId);
}
