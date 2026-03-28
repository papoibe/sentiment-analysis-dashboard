package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.ReviewAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewAssignmentRepository extends JpaRepository<ReviewAssignment, Long> {
    // Tim assignments theo trang thai
    List<ReviewAssignment> findByStatus(String status);

    // Tim assignments cua 1 nguoi
    List<ReviewAssignment> findByAssignedToId(Long userId);

    // Tim assignments theo review
    List<ReviewAssignment> findByReviewId(Long reviewId);
}
