package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity SentimentResult - ket qua phan tich AI cho moi review
// Quan he: OneToOne voi Review (1 review co 1 ket qua phan tich)
@Entity
@Table(name = "sentiment_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentimentResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Review tuong ung (quan he 1-1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", unique = true)
    private Review review;

    // Nhan sentiment: POSITIVE, NEGATIVE, NEUTRAL
    @Column(nullable = false, length = 20)
    private String sentiment;

    // Do tin cay tu 0.0 den 1.0
    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    // Response goc tu AI API (JSON string)
    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;

    // Thoi diem phan tich
    @Column(name = "analyzed_at")
    @Builder.Default
    private LocalDateTime analyzedAt = LocalDateTime.now();
}
