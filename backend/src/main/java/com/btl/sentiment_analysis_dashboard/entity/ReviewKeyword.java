package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

// Entity ReviewKeyword - lien ket nhieu-nhieu giua Review va Keyword
// Ghi nhan tu khoa nao xuat hien trong review nao va so lan
@Entity
@Table(name = "review_keywords")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewKeyword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id")
    private Keyword keyword;

    // So lan tu khoa xuat hien trong review
    @Builder.Default
    private Integer frequency = 1;
}
