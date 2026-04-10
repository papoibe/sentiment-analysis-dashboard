package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

// Service trich xuat keyword tu noi dung review
// Ket hop 2 phuong phap: match voi bang keywords (DB) + frequency-based extraction
@Service
public class KeywordExtractionService {

    private static final Logger log = LoggerFactory.getLogger(KeywordExtractionService.class);

    private final KeywordRepository keywordRepository;
    private final ReviewKeywordRepository reviewKeywordRepository;
    private final SentimentAnalyzer sentimentAnalyzer;

    // Danh sach stopwords tieng Viet - loai bo khi trich xuat keyword
    private static final Set<String> VIETNAMESE_STOPWORDS = Set.of(
            "toi", "ban", "cua", "va", "la", "co", "khong", "nhu", "mot", "nhung",
            "cac", "cho", "voi", "thi", "ma", "da", "deu", "nay", "do", "tai",
            "se", "duoc", "boi", "vi", "khi", "noi", "day", "con", "hon", "cung",
            "de", "tu", "den", "trong", "ngoai", "theo", "qua", "lai", "di",
            "len", "xuong", "vao", "ra", "roi", "nhi", "a", "o", "u", "e",
            "the", "tren", "duoi", "truoc", "sau", "giua", "het", "rat",
            "nhieu", "it", "them", "bot", "moi", "cu", "nua", "vua"
    );

    public KeywordExtractionService(KeywordRepository keywordRepository,
                                     ReviewKeywordRepository reviewKeywordRepository,
                                     SentimentAnalyzer sentimentAnalyzer) {
        this.keywordRepository = keywordRepository;
        this.reviewKeywordRepository = reviewKeywordRepository;
        this.sentimentAnalyzer = sentimentAnalyzer;
    }

    // Trich xuat keywords tu review va luu vao bang review_keywords
    // Tra ve so luong keywords da lien ket
    public int extractAndSave(Review review) {
        String content = review.getContent();
        if (content == null || content.isBlank()) return 0;

        String normalized = removeDiacritics(content.toLowerCase());
        int keywordsLinked = 0;

        // Buoc 1: Match voi keywords dang duoc tracking trong DB
        List<Keyword> activeKeywords = keywordRepository.findByIsActiveTrue();
        for (Keyword keyword : activeKeywords) {
            String kwNormalized = removeDiacritics(keyword.getKeyword().toLowerCase());

            // Dem so lan keyword xuat hien trong noi dung
            int frequency = countOccurrences(normalized, kwNormalized);
            if (frequency > 0) {
                // Tao ReviewKeyword lien ket review voi keyword
                ReviewKeyword rk = ReviewKeyword.builder()
                        .review(review)
                        .keyword(keyword)
                        .frequency(frequency)
                        .build();
                reviewKeywordRepository.save(rk);
                keywordsLinked++;
            }
        }

        // Buoc 2: Dung SentimentAnalyzer.extractKeywords() (OpenAI hoac Mock)
        // de tim them keywords khong co trong bang keywords
        try {
            List<String> aiKeywords = sentimentAnalyzer.extractKeywords(content);
            for (String kw : aiKeywords) {
                String kwNorm = removeDiacritics(kw.toLowerCase().trim());
                // Kiem tra keyword nay da match o Buoc 1 chua
                boolean alreadyLinked = activeKeywords.stream()
                        .anyMatch(ak -> removeDiacritics(ak.getKeyword().toLowerCase()).equals(kwNorm));

                if (!alreadyLinked && !kwNorm.isBlank() && kwNorm.length() > 1) {
                    // Tim hoac tao keyword moi trong DB
                    Keyword newKw = keywordRepository.findByIsActiveTrue().stream()
                            .filter(k -> removeDiacritics(k.getKeyword().toLowerCase()).equals(kwNorm))
                            .findFirst()
                            .orElse(null);

                    if (newKw == null) {
                        // Tao keyword moi tu AI extraction
                        newKw = Keyword.builder()
                                .keyword(kw.trim())
                                .category("AI_EXTRACTED") // Danh dau la do AI trich xuat
                                .isActive(true)
                                .build();
                        newKw = keywordRepository.save(newKw);
                    }

                    ReviewKeyword rk = ReviewKeyword.builder()
                            .review(review)
                            .keyword(newKw)
                            .frequency(1)
                            .build();
                    reviewKeywordRepository.save(rk);
                    keywordsLinked++;
                }
            }
        } catch (Exception e) {
            log.warn("AI keyword extraction loi, chi dung DB matching: {}", e.getMessage());
        }

        log.debug("Review #{} - Da lien ket {} keywords", review.getId(), keywordsLinked);
        return keywordsLinked;
    }

    // Dem so lan mot chuoi con xuat hien trong chuoi cha
    private int countOccurrences(String text, String keyword) {
        int count = 0;
        int idx = 0;
        while ((idx = text.indexOf(keyword, idx)) != -1) {
            count++;
            idx += keyword.length();
        }
        return count;
    }

    // Loai bo dau tieng Viet de so sanh tu khoa
    private String removeDiacritics(String input) {
        if (input == null) return "";
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
