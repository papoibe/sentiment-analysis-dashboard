package com.btl.sentiment_analysis_dashboard.dto;

import java.time.LocalDateTime;

// DTO Assign Review Request - Manager giao review cho team member
public record AssignReviewRequest(
        Long assignedTo, // ID nguoi duoc giao
        LocalDateTime deadline // Han xu ly (optional)
) {
}
