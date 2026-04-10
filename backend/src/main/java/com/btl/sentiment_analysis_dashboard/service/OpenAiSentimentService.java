package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.config.OpenAiProperties;
import com.btl.sentiment_analysis_dashboard.entity.Review;
import com.btl.sentiment_analysis_dashboard.entity.SentimentResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

// Service goi OpenAI API de phan tich sentiment thuc
// Su dung RestClient (built-in Spring Boot 4.x) goi POST /chat/completions
// Neu loi/timeout -> fallback ve MockSentimentService
@Service
public class OpenAiSentimentService implements SentimentAnalyzer {

    private static final Logger log = LoggerFactory.getLogger(OpenAiSentimentService.class);

    private final OpenAiProperties props;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAiSentimentService(OpenAiProperties props) {
        this.props = props;
        this.objectMapper = new ObjectMapper();
        // Tao RestClient voi base URL cua OpenAI
        this.restClient = RestClient.builder()
                .baseUrl(props.getBaseUrl())
                .build();
    }

    // Goi OpenAI API phan tich sentiment cho 1 review
    @Override
    public SentimentResult analyze(Review review) {
        String content = review.getContent();

        // Tao request body theo OpenAI Chat Completions API format
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", props.getModel());
        requestBody.put("temperature", props.getTemperature());
        requestBody.put("max_tokens", 150); // Gioi han token tra ve

        // System prompt: huong dan AI phan tich sentiment tieng Viet
        Map<String, String> systemMessage = Map.of(
                "role", "system",
                "content", "Bạn là AI phân tích sentiment tiếng Việt cho review ẩm thực. " +
                        "Trả về JSON duy nhất (không markdown, không giải thích): " +
                        "{\"sentiment\": \"POSITIVE|NEGATIVE|NEUTRAL\", \"confidence\": 0.0-1.0, \"keywords\": [\"kw1\",\"kw2\",\"kw3\"]}"
        );

        // User prompt: noi dung review can phan tich
        Map<String, String> userMessage = Map.of(
                "role", "user",
                "content", "Phân tích review sau: " + content
        );

        requestBody.put("messages", List.of(systemMessage, userMessage));

        try {
            // Goi POST /chat/completions toi OpenAI
            String responseJson = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + props.getApi().getKey())
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // Parse response JSON tu OpenAI
            return parseOpenAiResponse(review, responseJson);

        } catch (Exception e) {
            log.error("Loi goi OpenAI API: {}", e.getMessage());
            throw e; // De SentimentServiceRouter bat va fallback
        }
    }

    // Trich xuat keyword tu noi dung bang OpenAI
    @Override
    public List<String> extractKeywords(String content) {
        // Keywords da duoc tra ve trong response cua analyze()
        // Method nay dung khi can goi rieng
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", props.getModel());
            requestBody.put("temperature", 0.2);
            requestBody.put("max_tokens", 100);

            Map<String, String> systemMsg = Map.of(
                    "role", "system",
                    "content", "Trích xuất 3-5 từ khóa quan trọng nhất từ review tiếng Việt. " +
                            "Trả về JSON: {\"keywords\": [\"kw1\",\"kw2\",\"kw3\"]}"
            );
            Map<String, String> userMsg = Map.of("role", "user", "content", content);
            requestBody.put("messages", List.of(systemMsg, userMsg));

            String responseJson = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + props.getApi().getKey())
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // Parse keywords tu response
            JsonNode root = objectMapper.readTree(responseJson);
            String aiContent = root.path("choices").get(0).path("message").path("content").asText();
            // Xoa markdown wrapper neu co
            aiContent = aiContent.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
            JsonNode parsed = objectMapper.readTree(aiContent);
            List<String> keywords = new ArrayList<>();
            if (parsed.has("keywords")) {
                parsed.get("keywords").forEach(kw -> keywords.add(kw.asText()));
            }
            return keywords;

        } catch (Exception e) {
            log.error("Loi trich xuat keywords bang OpenAI: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    // Parse response JSON tu OpenAI Chat Completions API
    // Response format: { choices: [{ message: { content: "{\"sentiment\":...,\"confidence\":...,\"keywords\":...}" } }] }
    private SentimentResult parseOpenAiResponse(Review review, String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);

            // Lay noi dung AI tra ve tu choices[0].message.content
            String aiContent = root.path("choices").get(0).path("message").path("content").asText();

            // Xoa markdown wrapper neu AI tra ve dang ```json ... ```
            aiContent = aiContent.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();

            // Parse JSON sentiment result
            JsonNode parsed = objectMapper.readTree(aiContent);
            String sentiment = parsed.path("sentiment").asText("NEUTRAL");
            double confidence = parsed.path("confidence").asDouble(0.5);

            // Dam bao sentiment hop le
            if (!List.of("POSITIVE", "NEGATIVE", "NEUTRAL").contains(sentiment)) {
                sentiment = "NEUTRAL";
            }

            return SentimentResult.builder()
                    .review(review)
                    .sentiment(sentiment)
                    .confidenceScore(confidence)
                    .rawResponse(responseJson) // Luu full response de debug
                    .build();

        } catch (Exception e) {
            log.error("Loi parse OpenAI response: {}", e.getMessage());
            // Fallback: tra ve NEUTRAL neu parse loi
            return SentimentResult.builder()
                    .review(review)
                    .sentiment("NEUTRAL")
                    .confidenceScore(0.5)
                    .rawResponse(responseJson)
                    .build();
        }
    }
}
