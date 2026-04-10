package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity Alert - cau hinh canh bao tu dong khi co reviews tieu cuc
// Manager tao alert rule, he thong tu dong kiem tra va thong bao
@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nguoi tao alert (Manager)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Loai dieu kien: NEGATIVE_COUNT, LOW_CONFIDENCE
    @Column(name = "condition_type", nullable = false, length = 50)
    private String conditionType;

    // Nguong so luong (vd: > 5 negative reviews)
    @Column(nullable = false)
    private Integer threshold;

    // Nguong confidence score
    @Column(name = "confidence_threshold")
    private Double confidenceThreshold;

    // Kenh thong bao: EMAIL, IN_APP
    @Column(nullable = false, length = 30)
    private String channel;

    // Dang hoat dong hay khong
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
