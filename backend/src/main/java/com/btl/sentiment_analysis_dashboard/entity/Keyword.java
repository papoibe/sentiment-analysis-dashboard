package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity Keyword - tu khoa can theo doi trong reviews
@Entity
@Table(name = "keywords")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Keyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tu khoa (vd: "ngon", "chat luong kem")
    @Column(nullable = false, length = 100)
    private String keyword;

    // Nhom tu khoa: FOOD_QUALITY, SERVICE, PRICE, ATMOSPHERE, ...
    @Column(length = 50)
    private String category;

    // Dang tracking hay khong
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
