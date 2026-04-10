package com.btl.sentiment_analysis_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity ReviewAssignment - giao review cho team member xu ly
// Manager assign review cho Analyst/Member, theo doi trang thai xu ly
@Entity
@Table(name = "review_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Review duoc giao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    // Nguoi duoc giao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // Nguoi giao (Manager)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    // Trang thai: PENDING, IN_PROGRESS, RESOLVED
    @Column(length = 30)
    @Builder.Default
    private String status = "PENDING";

    // Han xu ly
    private LocalDateTime deadline;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
