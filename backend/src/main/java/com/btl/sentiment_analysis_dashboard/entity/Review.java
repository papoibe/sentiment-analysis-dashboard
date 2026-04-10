package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity Review - noi dung review tu khach hang
// Quan he: ManyToOne voi DataSource, ManyToOne voi User (assigned_to)
@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Noi dung review (tu cot Comment cua dataset)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // Loai nguon goc: GOOGLE, FACEBOOK, CSV
    @Column(name = "source_type", length = 50)
    private String sourceType;

    // Thuoc data source nao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_source_id")
    private DataSource dataSource;

    // Trang thai xu ly: NEW, FLAGGED, ASSIGNED, IN_PROGRESS, RESOLVED
    @Column(length = 30)
    @Builder.Default
    private String status = "NEW";

    // Muc uu tien: HIGH, MEDIUM, LOW
    @Column(length = 20)
    private String priority;

    // Nguoi duoc giao xu ly
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // Ghi chu khi flag review
    @Column(name = "flag_note", columnDefinition = "TEXT")
    private String flagNote;

    // Ngay import / tao - dung cho Trend Analysis theo thoi gian
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
