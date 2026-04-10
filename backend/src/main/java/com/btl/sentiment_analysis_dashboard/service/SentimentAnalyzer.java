package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.entity.Review;
import com.btl.sentiment_analysis_dashboard.entity.SentimentResult;
import java.util.List;

// Interface chung cho ca OpenAI va Mock sentiment analysis
// Cho phep chuyen doi giua 2 mode ma khong anh huong logic khac
public interface SentimentAnalyzer {

    // Phan tich sentiment cho 1 review -> tra ve SentimentResult
    SentimentResult analyze(Review review);

    // Trich xuat keyword tu noi dung review
    List<String> extractKeywords(String content);
}
