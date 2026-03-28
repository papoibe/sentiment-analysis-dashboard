package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity DataSource - nguon du lieu reviews (CSV, Excel, Google, Facebook)
// Quan he: ManyToOne voi User (nguoi tao) va Business (doanh nghiep)
@Entity
@Table(name = "data_sources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataSource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ten nguon du lieu (vd: "Google Reviews Q1")
    @Column(nullable = false, length = 200)
    private String name;

    // Loai: CSV, EXCEL, GOOGLE, FACEBOOK
    @Column(nullable = false, length = 50)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Nguoi tao (Manager)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Thuoc doanh nghiep nao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    private Business business;

    // Trang thai soft delete
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
