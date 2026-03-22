package com.btl.sentiment_analysis_dashboard.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String sentiment; // POSITIVE, NEGATIVE, NEUTRAL
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_source_id")
    private DataSource dataSource;
    
    private String status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
