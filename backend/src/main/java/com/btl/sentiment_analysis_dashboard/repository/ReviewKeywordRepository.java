package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.ReviewKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewKeywordRepository extends JpaRepository<ReviewKeyword, Long> {
    // Tim tat ca review-keyword theo review id
    List<ReviewKeyword> findByReviewId(Long reviewId);

    // Tim tat ca review-keyword theo keyword id
    List<ReviewKeyword> findByKeywordId(Long keywordId);
}
