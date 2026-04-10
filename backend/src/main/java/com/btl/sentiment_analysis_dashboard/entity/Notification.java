package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity Notification - thong bao he thong tu Admin gui den users
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Nguoi gui (Admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    // Gui den role nao: ALL, ANALYST, MANAGER
    @Column(name = "target_role", length = 50)
    private String targetRole;

    // Da doc chua
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    // Thoi gian hen gui
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    // Thoi diem gui thuc te
    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
