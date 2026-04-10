package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Tim thong bao theo target role (vd: ALL, ANALYST, MANAGER)
    List<Notification> findByTargetRole(String targetRole);

    // Tim thong bao gui boi admin cu the
    List<Notification> findBySenderId(Long senderId);
}
