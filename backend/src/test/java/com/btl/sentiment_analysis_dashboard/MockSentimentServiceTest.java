package com.btl.sentiment_analysis_dashboard;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.service.MockSentimentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

// Unit test cho MockSentimentService — logic phân tích sentiment bằng keyword
class MockSentimentServiceTest {

    private MockSentimentService service;

    @BeforeEach
    void setUp() {
        service = new MockSentimentService();
    }

    // Test phan tich review tich cuc
    @Test
    void testAnalyzePositiveReview() {
        Review review = Review.builder()
                .content("Phở rất ngon, nước dùng đậm đà, nhân viên thân thiện")
                .build();

        SentimentResult result = service.analyze(review);

        assertEquals("POSITIVE", result.getSentiment());
        assertTrue(result.getConfidenceScore() >= 0.6);
        assertNotNull(result.getRawResponse());
    }

    // Test phan tich review tieu cuc
    @Test
    void testAnalyzeNegativeReview() {
        Review review = Review.builder()
                .content("Dịch vụ tệ, đồ ăn dở, thái độ nhân viên kém")
                .build();

        SentimentResult result = service.analyze(review);

        assertEquals("NEGATIVE", result.getSentiment());
        assertTrue(result.getConfidenceScore() <= 0.4);
    }

    // Test phan tich review trung lap
    @Test
    void testAnalyzeNeutralReview() {
        Review review = Review.builder()
                .content("Quán bình thường, không có gì đặc biệt lắm")
                .build();

        SentimentResult result = service.analyze(review);

        // Neutral khi không tìm thấy từ khóa hoặc cân bằng
        assertNotNull(result.getSentiment());
        assertTrue(result.getConfidenceScore() >= 0.0 && result.getConfidenceScore() <= 1.0);
    }

    // Test confidence score luon trong khoang [0, 1]
    @Test
    void testConfidenceScoreRange() {
        String[] reviews = {
            "Tuyệt vời!", "Tệ quá!", "Bình thường", "Ngon lắm, sạch sẽ",
            "Chậm, đắt, kém chất lượng"
        };

        for (String content : reviews) {
            Review review = Review.builder().content(content).build();
            SentimentResult result = service.analyze(review);
            assertTrue(result.getConfidenceScore() >= 0.0, "Score phải >= 0");
            assertTrue(result.getConfidenceScore() <= 1.0, "Score phải <= 1");
        }
    }

    // Test extract keywords
    @Test
    void testExtractKeywordsPositive() {
        List<String> keywords = service.extractKeywords("Phở ngon, giá rẻ, sạch sẽ");

        assertNotNull(keywords);
        assertFalse(keywords.isEmpty());
        assertTrue(keywords.size() <= 5); // Tối đa 5 keywords
    }

    // Test extract keywords tieu cuc
    @Test
    void testExtractKeywordsNegative() {
        List<String> keywords = service.extractKeywords("Dịch vụ tệ, chậm, đắt");

        assertNotNull(keywords);
        assertFalse(keywords.isEmpty());
    }

    // Test extract keywords voi noi dung rong
    @Test
    void testExtractKeywordsEmpty() {
        List<String> keywords = service.extractKeywords("");
        assertNotNull(keywords);
        assertTrue(keywords.isEmpty());

        List<String> nullKeywords = service.extractKeywords(null);
        assertNotNull(nullKeywords);
        assertTrue(nullKeywords.isEmpty());
    }

    // Test rawResponse chua JSON metadata
    @Test
    void testRawResponseContainsMetadata() {
        Review review = Review.builder()
                .content("Ngon quá, thích lắm")
                .build();

        SentimentResult result = service.analyze(review);

        assertTrue(result.getRawResponse().contains("keyword_matching"));
        assertTrue(result.getRawResponse().contains("positive"));
        assertTrue(result.getRawResponse().contains("negative"));
    }
}
