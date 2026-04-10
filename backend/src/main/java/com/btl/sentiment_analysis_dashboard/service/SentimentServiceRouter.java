package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.config.OpenAiProperties;
import com.btl.sentiment_analysis_dashboard.entity.Review;
import com.btl.sentiment_analysis_dashboard.entity.SentimentResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

// Router tu dong chon giua OpenAI (neu co API key) hoac Mock (neu khong co key)
// Danh dau @Primary de Spring uu tien inject bean nay khi co nhieu SentimentAnalyzer
@Service
@Primary
public class SentimentServiceRouter implements SentimentAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(SentimentServiceRouter.class);

    private final OpenAiProperties props;
    private final OpenAiSentimentService openAiService;
    private final MockSentimentService mockService;

    public SentimentServiceRouter(OpenAiProperties props,
                                  OpenAiSentimentService openAiService,
                                  MockSentimentService mockService) {
        this.props = props;
        this.openAiService = openAiService;
        this.mockService = mockService;

        // Log mode hien tai khi khoi dong
        if (props.isEnabled()) {
            log.info("=== AI Mode: OPENAI_CONNECTED (model: {}) ===", props.getModel());
        } else {
            log.info("=== AI Mode: MOCK_MODE (keyword matching) ===");
        }
    }

    // Tu dong chon OpenAI hoac Mock de phan tich sentiment
    // Neu OpenAI loi/timeout -> fallback ve Mock
    @Override
    public SentimentResult analyze(Review review) {
        if (props.isEnabled()) {
            try {
                log.debug("Goi OpenAI API cho review #{}", review.getId());
                return openAiService.analyze(review);
            } catch (Exception e) {
                log.warn("OpenAI API loi, fallback ve Mock: {}", e.getMessage());
                return mockService.analyze(review); // Fallback khi loi
            }
        }
        return mockService.analyze(review); // Mock mode
    }

    // Tu dong chon OpenAI hoac Mock de trich xuat keywords
    @Override
    public List<String> extractKeywords(String content) {
        if (props.isEnabled()) {
            try {
                List<String> keywords = openAiService.extractKeywords(content);
                if (!keywords.isEmpty()) return keywords;
            } catch (Exception e) {
                log.warn("OpenAI extractKeywords loi, fallback: {}", e.getMessage());
            }
        }
        return mockService.extractKeywords(content); // Fallback
    }

    // Kiem tra mode hien tai: OPENAI_CONNECTED hoac MOCK_MODE
    public String getCurrentMode() {
        return props.isEnabled() ? "OPENAI_CONNECTED" : "MOCK_MODE";
    }

    // Lay model dang su dung
    public String getCurrentModel() {
        return props.isEnabled() ? props.getModel() : "mock-sentiment-v1";
    }
}
