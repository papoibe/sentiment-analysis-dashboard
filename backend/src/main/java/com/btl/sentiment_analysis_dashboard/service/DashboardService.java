package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.dto.DashboardSummaryResponse;
import com.btl.sentiment_analysis_dashboard.dto.TrendDataPoint;
import com.btl.sentiment_analysis_dashboard.entity.SentimentResult;
import com.btl.sentiment_analysis_dashboard.repository.ReviewRepository;
import com.btl.sentiment_analysis_dashboard.repository.SentimentResultRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// Service tinh toan du lieu cho Dashboard: summary va trend
@Service
public class DashboardService {

    private final ReviewRepository reviewRepository;
    private final SentimentResultRepository sentimentResultRepository;

    public DashboardService(ReviewRepository reviewRepository,
            SentimentResultRepository sentimentResultRepository) {
        this.reviewRepository = reviewRepository;
        this.sentimentResultRepository = sentimentResultRepository;
    }

    // Tinh tong quan dashboard: so luong review, ty le sentiment, confidence trung
    // binh
    public DashboardSummaryResponse getSummary(Long dataSourceId, LocalDate fromDate, LocalDate toDate) {
        List<SentimentResult> results = sentimentResultRepository.findAll();

        // Loc theo data source neu co
        if (dataSourceId != null) {
            results = results.stream()
                    .filter(r -> r.getReview().getDataSource() != null &&
                            r.getReview().getDataSource().getId().equals(dataSourceId))
                    .collect(Collectors.toList());
        }

        // Loc theo khoang thoi gian neu co
        if (fromDate != null && toDate != null) {
            LocalDateTime from = fromDate.atStartOfDay();
            LocalDateTime to = toDate.plusDays(1).atStartOfDay();
            results = results.stream()
                    .filter(r -> {
                        LocalDateTime createdAt = r.getReview().getCreatedAt();
                        return createdAt != null && !createdAt.isBefore(from) && createdAt.isBefore(to);
                    })
                    .collect(Collectors.toList());
        }

        long total = results.size();
        long positive = results.stream().filter(r -> "POSITIVE".equals(r.getSentiment())).count();
        long negative = results.stream().filter(r -> "NEGATIVE".equals(r.getSentiment())).count();
        long neutral = total - positive - negative;

        double avgConfidence = results.stream()
                .mapToDouble(SentimentResult::getConfidenceScore)
                .average().orElse(0.0);

        // Dem review moi trong 7 ngay gan nhat
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        long newThisWeek = results.stream()
                .filter(r -> r.getReview().getCreatedAt() != null &&
                        r.getReview().getCreatedAt().isAfter(oneWeekAgo))
                .count();

        return new DashboardSummaryResponse(
                total, positive, negative, neutral,
                total > 0 ? (positive * 100.0 / total) : 0,
                total > 0 ? (negative * 100.0 / total) : 0,
                total > 0 ? (neutral * 100.0 / total) : 0,
                Math.round(avgConfidence * 100.0) / 100.0,
                newThisWeek);
    }

    // Tinh du lieu trend theo ngay cho bieu do line chart
    public List<TrendDataPoint> getTrend(String period, Long dataSourceId,
            LocalDate fromDate, LocalDate toDate) {
        // Xac dinh khoang thoi gian
        LocalDate end = LocalDate.now();
        LocalDate start;
        if ("custom".equals(period) && fromDate != null && toDate != null) {
            start = fromDate;
            end = toDate;
        } else {
            int days = switch (period) {
                case "7d" -> 7;
                case "90d" -> 90;
                default -> 30; // Mac dinh 30 ngay
            };
            start = end.minusDays(days);
        }

        List<SentimentResult> allResults = sentimentResultRepository.findAll();

        // Loc theo data source neu co
        if (dataSourceId != null) {
            allResults = allResults.stream()
                    .filter(r -> r.getReview().getDataSource() != null &&
                            r.getReview().getDataSource().getId().equals(dataSourceId))
                    .collect(Collectors.toList());
        }

        // Nhom theo ngay va dem sentiment
        List<TrendDataPoint> trendData = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            List<SentimentResult> dayResults = allResults.stream()
                    .filter(r -> r.getReview().getCreatedAt() != null &&
                            r.getReview().getCreatedAt().toLocalDate().equals(currentDate))
                    .collect(Collectors.toList());

            long pos = dayResults.stream().filter(r -> "POSITIVE".equals(r.getSentiment())).count();
            long neg = dayResults.stream().filter(r -> "NEGATIVE".equals(r.getSentiment())).count();
            long neu = dayResults.size() - pos - neg;

            trendData.add(new TrendDataPoint(currentDate, pos, neg, neu, dayResults.size()));
        }
        return trendData;
    }
}
