package com.btl.sentiment_analysis_dashboard;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.service.UserMapper;
import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

// Unit test cho Entity va Mapper
class EntityTest {

    // Test Role enum co du 3 gia tri
    @Test
    void testRoleEnum() {
        assertEquals(3, Role.values().length);
        assertNotNull(Role.valueOf("ANALYST"));
        assertNotNull(Role.valueOf("MANAGER"));
        assertNotNull(Role.valueOf("ADMIN"));
    }

    // Test User entity builder
    @Test
    void testUserBuilder() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .passwordHash("hashedpass")
                .email("test@example.com")
                .fullName("Test User")
                .role(Role.ANALYST)
                .build();

        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals(Role.ANALYST, user.getRole());
        assertEquals("Test User", user.getFullName());
    }

    // Test User default role la ANALYST
    @Test
    void testUserDefaultRole() {
        User user = User.builder()
                .username("newuser")
                .passwordHash("hash")
                .email("new@test.com")
                .build();

        assertEquals(Role.ANALYST, user.getRole());
    }

    // Test Review entity builder
    @Test
    void testReviewBuilder() {
        Review review = Review.builder()
                .id(1L)
                .content("Review content here")
                .sourceType("GOOGLE")
                .status("NEW")
                .priority("HIGH")
                .build();

        assertEquals("Review content here", review.getContent());
        assertEquals("GOOGLE", review.getSourceType());
        assertEquals("NEW", review.getStatus());
        assertEquals("HIGH", review.getPriority());
    }

    // Test Review default status la NEW
    @Test
    void testReviewDefaultStatus() {
        Review review = Review.builder()
                .content("Test")
                .build();

        assertEquals("NEW", review.getStatus());
    }

    // Test SentimentResult builder
    @Test
    void testSentimentResultBuilder() {
        Review review = Review.builder().content("Test").build();

        SentimentResult result = SentimentResult.builder()
                .sentiment("POSITIVE")
                .confidenceScore(0.95)
                .review(review)
                .rawResponse("{}")
                .build();

        assertEquals("POSITIVE", result.getSentiment());
        assertEquals(0.95, result.getConfidenceScore());
        assertNotNull(result.getReview());
    }

    // Test Business entity
    @Test
    void testBusinessBuilder() {
        Business biz = Business.builder()
                .name("Test Business")
                .description("A test business")
                .isActive(true)
                .build();

        assertEquals("Test Business", biz.getName());
        assertTrue(biz.getIsActive());
    }

    // Test Keyword entity
    @Test
    void testKeywordBuilder() {
        Keyword kw = Keyword.builder()
                .keyword("ngon")
                .category("FOOD_QUALITY")
                .isActive(true)
                .build();

        assertEquals("ngon", kw.getKeyword());
        assertEquals("FOOD_QUALITY", kw.getCategory());
    }

    // Test Alert entity
    @Test
    void testAlertBuilder() {
        Alert alert = Alert.builder()
                .conditionType("NEGATIVE_COUNT")
                .threshold(10)
                .channel("EMAIL")
                .isActive(true)
                .build();

        assertEquals("NEGATIVE_COUNT", alert.getConditionType());
        assertEquals(10, alert.getThreshold());
        assertTrue(alert.getIsActive());
    }

    // Test UserMapper
    @Test
    void testUserMapper() {
        UserMapper mapper = new UserMapper();

        User user = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@test.com")
                .role(Role.ADMIN)
                .fullName("Admin User")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        UserResponse response = mapper.toResponse(user);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("admin", response.username());
        assertEquals("admin@test.com", response.email());
        assertEquals(Role.ADMIN, response.role());
    }

    // Test UserMapper voi null input
    @Test
    void testUserMapperNull() {
        UserMapper mapper = new UserMapper();
        UserResponse response = mapper.toResponse(null);
        assertNull(response);
    }
}
