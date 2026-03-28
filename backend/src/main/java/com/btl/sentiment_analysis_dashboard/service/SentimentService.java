package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;

// Service mock phan tich sentiment bang tu khoa tieng Viet
// Khong can OpenAI API key cho demo - dung logic don gian
@Service
public class SentimentService {

    // Danh sach tu khoa tich cuc tieng Viet
    private static final List<String> POSITIVE_KEYWORDS = Arrays.asList(
            "ngon", "tuyet voi", "tot", "hay", "dep", "thich", "xuat sac",
            "ung y", "hoan hao", "chat luong", "nhanh", "than thien",
            "sach se", "re", "gia hop ly", "dang dong tien", "phu hop",
            "an tuong", "chuyen nghiep", "nhiet tinh");

    // Danh sach tu khoa tieu cuc tieng Viet
    private static final List<String> NEGATIVE_KEYWORDS = Arrays.asList(
            "do", "te", "kem", "cham", "dat", "ban", "toi",
            "kho chiu", "that vong", "chan", "that bai", "loi",
            "hong", "hu", "thua", "nham chan", "khong tot",
            "mat ve sinh", "thai do", "tieu cuc");

    // Phan tich sentiment cho 1 review dua tren tu khoa
    // Tra ve SentimentResult voi nhan va confidence score
    public SentimentResult analyzeSentiment(Review review) {
        String content = removeDiacritics(review.getContent().toLowerCase());

        int positiveCount = 0;
        int negativeCount = 0;

        // Dem so tu khoa positive/negative xuat hien trong noi dung
        for (String keyword : POSITIVE_KEYWORDS) {
            if (content.contains(keyword)) {
                positiveCount++;
            }
        }
        for (String keyword : NEGATIVE_KEYWORDS) {
            if (content.contains(keyword)) {
                negativeCount++;
            }
        }

        // Tinh confidence score tu 0.0 den 1.0
        int totalFound = positiveCount + negativeCount;
        double confidenceScore;
        String sentiment;

        if (totalFound == 0) {
            // Khong tim thay tu khoa nao -> random nhe
            confidenceScore = 0.5 + (Math.random() * 0.1 - 0.05);
            sentiment = "NEUTRAL";
        } else {
            // Tinh ty le positive
            double positiveRatio = (double) positiveCount / totalFound;
            confidenceScore = Math.max(0.0, Math.min(1.0, positiveRatio));

            // Gan nhan theo nguong confidence (theo database-design.md)
            if (confidenceScore >= 0.6) {
                sentiment = "POSITIVE";
            } else if (confidenceScore <= 0.4) {
                sentiment = "NEGATIVE";
            } else {
                sentiment = "NEUTRAL";
            }
        }

        return SentimentResult.builder()
                .review(review)
                .sentiment(sentiment)
                .confidenceScore(confidenceScore)
                .rawResponse("{\"method\":\"keyword_matching\",\"positive\":" + positiveCount +
                        ",\"negative\":" + negativeCount + "}")
                .build();
    }

    // Loai bo dau tieng Viet de so sanh tu khoa don gian
    private String removeDiacritics(String input) {
        if (input == null)
            return "";
        // Thay the cac ky tu co dau bang ky tu khong dau
        String result = input;
        result = result.replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a");
        result = result.replaceAll("[èéẹẻẽêềếệểễ]", "e");
        result = result.replaceAll("[ìíịỉĩ]", "i");
        result = result.replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o");
        result = result.replaceAll("[ùúụủũưừứựửữ]", "u");
        result = result.replaceAll("[ỳýỵỷỹ]", "y");
        result = result.replaceAll("[đ]", "d");
        return result;
    }
}
