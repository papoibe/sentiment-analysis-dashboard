package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import com.btl.sentiment_analysis_dashboard.repository.*;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

// Controller cho Review APIs - Analyst (3 endpoints) + Manager (3 endpoints)
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

        private final ReviewRepository reviewRepository;
        private final SentimentResultRepository sentimentResultRepository;
        private final UserRepository userRepository;
        private final ReviewAssignmentRepository reviewAssignmentRepository;

        public ReviewController(ReviewRepository reviewRepository,
                        SentimentResultRepository sentimentResultRepository,
                        UserRepository userRepository,
                        ReviewAssignmentRepository reviewAssignmentRepository) {
                this.reviewRepository = reviewRepository;
                this.sentimentResultRepository = sentimentResultRepository;
                this.userRepository = userRepository;
                this.reviewAssignmentRepository = reviewAssignmentRepository;
        }

        // === ANALYST APIs ===

        // GET /reviews/top - Top positive/negative reviews
        @GetMapping("/top")
        public ResponseEntity<ApiResponse<List<ReviewResponse>>> getTopReviews(
                        @RequestParam(defaultValue = "positive") String type,
                        @RequestParam(defaultValue = "10") int limit) {
                List<SentimentResult> results = sentimentResultRepository.findAll();
                String sentiment = "positive".equalsIgnoreCase(type) ? "POSITIVE" : "NEGATIVE";

                // Loc theo loai sentiment va sap xep theo confidence giam dan
                List<ReviewResponse> topReviews = results.stream()
                                .filter(r -> sentiment.equals(r.getSentiment()))
                                .sorted(Comparator.comparingDouble(SentimentResult::getConfidenceScore).reversed())
                                .limit(limit)
                                .map(r -> new ReviewResponse(
                                                r.getReview().getId(), r.getReview().getContent(),
                                                r.getSentiment(), r.getConfidenceScore(),
                                                r.getReview().getDataSource() != null
                                                                ? r.getReview().getDataSource().getName()
                                                                : null,
                                                r.getReview().getStatus(), r.getReview().getPriority(),
                                                r.getReview().getCreatedAt()))
                                .collect(Collectors.toList());

                return ResponseEntity.ok(ApiResponse.success(topReviews));
        }

        // GET /reviews - Tim kiem va loc reviews (co phan trang)
        @GetMapping
        public ResponseEntity<ApiResponse<Map<String, Object>>> searchReviews(
                        @RequestParam(required = false) String keyword,
                        @RequestParam(required = false) String sentiment,
                        @RequestParam(required = false) Long dataSourceId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {

                // Lay tat ca reviews
                List<Review> reviews = reviewRepository.findAll();

                // Loc theo keyword
                if (keyword != null && !keyword.isEmpty()) {
                        reviews = reviews.stream()
                                        .filter(r -> r.getContent().toLowerCase().contains(keyword.toLowerCase()))
                                        .collect(Collectors.toList());
                }

                // Loc theo data source
                if (dataSourceId != null) {
                        reviews = reviews.stream()
                                        .filter(r -> r.getDataSource() != null
                                                        && r.getDataSource().getId().equals(dataSourceId))
                                        .collect(Collectors.toList());
                }

                // Loc theo sentiment
                if (sentiment != null && !sentiment.isEmpty()) {
                        final String sentimentFilter = sentiment.toUpperCase();
                        reviews = reviews.stream()
                                        .filter(r -> {
                                                Optional<SentimentResult> sr = sentimentResultRepository
                                                                .findByReviewId(r.getId());
                                                return sr.isPresent()
                                                                && sentimentFilter.equals(sr.get().getSentiment());
                                        })
                                        .collect(Collectors.toList());
                }

                int total = reviews.size();
                int start = page * size;
                int end = Math.min(start + size, total);
                List<Review> pageContent = start < total ? reviews.subList(start, end) : List.of();

                // Map sang ReviewResponse
                List<ReviewResponse> responseList = pageContent.stream().map(r -> {
                        Optional<SentimentResult> sr = sentimentResultRepository.findByReviewId(r.getId());
                        return new ReviewResponse(
                                        r.getId(), r.getContent(),
                                        sr.map(SentimentResult::getSentiment).orElse(null),
                                        sr.map(SentimentResult::getConfidenceScore).orElse(null),
                                        r.getDataSource() != null ? r.getDataSource().getName() : null,
                                        r.getStatus(), r.getPriority(), r.getCreatedAt());
                }).collect(Collectors.toList());

                Map<String, Object> data = new HashMap<>();
                data.put("content", responseList);
                data.put("page", page);
                data.put("size", size);
                data.put("total_elements", total);
                data.put("total_pages", (int) Math.ceil((double) total / size));

                return ResponseEntity.ok(ApiResponse.success(data));
        }

        // === MANAGER APIs ===

        // PUT /reviews/{id}/flag - Danh dau review can xu ly
        @PutMapping("/{id}/flag")
        public ResponseEntity<ApiResponse<Map<String, Object>>> flagReview(
                        @PathVariable Long id, @RequestBody FlagReviewRequest request) {
                Review review = reviewRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Review không tồn tại với id: " + id));

                review.setStatus("FLAGGED");
                review.setPriority(request.priority());
                review.setFlagNote(request.note());
                reviewRepository.save(review);

                Map<String, Object> data = new HashMap<>();
                data.put("id", review.getId());
                data.put("status", review.getStatus());
                data.put("priority", review.getPriority());
                data.put("flag_note", review.getFlagNote());

                return ResponseEntity.ok(ApiResponse.success(data));
        }

        // PUT /reviews/{id}/assign - Assign review cho team member
        @PutMapping("/{id}/assign")
        public ResponseEntity<ApiResponse<Map<String, Object>>> assignReview(
                        @PathVariable Long id, @RequestBody AssignReviewRequest request) {
                Review review = reviewRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Review không tồn tại"));
                User assignee = userRepository.findById(request.assignedTo())
                                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

                review.setStatus("ASSIGNED");
                review.setAssignedTo(assignee);
                reviewRepository.save(review);

                // Tao assignment record
                ReviewAssignment assignment = ReviewAssignment.builder()
                                .review(review)
                                .assignedTo(assignee)
                                .deadline(request.deadline())
                                .build();
                reviewAssignmentRepository.save(assignment);

                Map<String, Object> data = new HashMap<>();
                data.put("review_id", review.getId());
                data.put("assigned_to", assignee.getFullName());
                data.put("status", "ASSIGNED");
                data.put("deadline", request.deadline());

                return ResponseEntity.ok(ApiResponse.success(data));
        }

        // GET /reviews/assignments - Theo doi trang thai xu ly
        @GetMapping("/assignments")
        public ResponseEntity<ApiResponse<Map<String, Object>>> getAssignments(
                        @RequestParam(required = false) String status,
                        @RequestParam(required = false) Long assignedTo,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {

                List<ReviewAssignment> assignments = reviewAssignmentRepository.findAll();

                if (status != null) {
                        assignments = assignments.stream()
                                        .filter(a -> status.equalsIgnoreCase(a.getStatus()))
                                        .collect(Collectors.toList());
                }
                if (assignedTo != null) {
                        assignments = assignments.stream()
                                        .filter(a -> a.getAssignedTo() != null
                                                        && a.getAssignedTo().getId().equals(assignedTo))
                                        .collect(Collectors.toList());
                }

                Map<String, Object> data = new HashMap<>();
                data.put("content", assignments);
                data.put("total_elements", assignments.size());

                return ResponseEntity.ok(ApiResponse.success(data));
        }
}
