package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.repository.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

// Service quan ly data sources va import CSV
@Service
public class DataSourceService {

    private final DataSourceRepository dataSourceRepository;
    private final ReviewRepository reviewRepository;
    private final SentimentResultRepository sentimentResultRepository;
    private final SentimentService sentimentService;

    public DataSourceService(DataSourceRepository dataSourceRepository,
            ReviewRepository reviewRepository,
            SentimentResultRepository sentimentResultRepository,
            SentimentService sentimentService) {
        this.dataSourceRepository = dataSourceRepository;
        this.reviewRepository = reviewRepository;
        this.sentimentResultRepository = sentimentResultRepository;
        this.sentimentService = sentimentService;
    }

    public List<DataSource> findAll() {
        return dataSourceRepository.findAll();
    }

    public DataSource findById(Long id) {
        return dataSourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DataSource không tồn tại với id: " + id));
    }

    public DataSource create(DataSource dataSource) {
        return dataSourceRepository.save(dataSource);
    }

    public DataSource update(Long id, DataSource updated) {
        DataSource existing = findById(id);
        if (updated.getName() != null)
            existing.setName(updated.getName());
        if (updated.getDescription() != null)
            existing.setDescription(updated.getDescription());
        if (updated.getType() != null)
            existing.setType(updated.getType());
        return dataSourceRepository.save(existing);
    }

    // Soft delete - chi danh dau isActive = false
    public void delete(Long id) {
        DataSource ds = findById(id);
        ds.setIsActive(false);
        dataSourceRepository.save(ds);
    }

    // Import CSV file - doc tung dong va tao Review + phan tich sentiment
    // File CSV can co cot "Comment" (noi dung review)
    public Map<String, Object> importCsv(Long dataSourceId, MultipartFile file) throws IOException {
        DataSource dataSource = findById(dataSourceId);
        int imported = 0;
        int failed = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();
            if (rows.isEmpty())
                return Map.of("imported_count", 0, "failed_count", 0);

            // Tim vi tri cot Comment trong header
            String[] headers = rows.get(0);
            int commentIndex = -1;
            for (int i = 0; i < headers.length; i++) {
                if ("Comment".equalsIgnoreCase(headers[i].trim()) ||
                        "comment".equalsIgnoreCase(headers[i].trim())) {
                    commentIndex = i;
                    break;
                }
            }
            if (commentIndex == -1)
                commentIndex = 0; // Mac dinh lay cot dau tien

            // Doc tung dong du lieu (bo header)
            for (int i = 1; i < rows.size(); i++) {
                try {
                    String[] row = rows.get(i);
                    if (row.length <= commentIndex || row[commentIndex].trim().isEmpty()) {
                        failed++;
                        continue;
                    }

                    // Tao Review entity
                    Review review = Review.builder()
                            .content(row[commentIndex].trim())
                            .sourceType("CSV")
                            .dataSource(dataSource)
                            .status("NEW")
                            // Gan created_at ngau nhien trong 90 ngay gan day cho demo Trend Analysis
                            .createdAt(LocalDateTime.now().minusDays((long) (Math.random() * 90)))
                            .build();
                    review = reviewRepository.save(review);

                    // Phan tich sentiment bang mock AI service
                    SentimentResult result = sentimentService.analyzeSentiment(review);
                    sentimentResultRepository.save(result);

                    imported++;
                } catch (Exception e) {
                    failed++;
                }
            }
        } catch (CsvException e) {
            throw new IOException("Lỗi đọc file với CSV: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("imported_count", imported);
        response.put("failed_count", failed);
        response.put("sentiment_analyzed", imported);
        response.put("message", "Import thành công. AI đã phân tích sentiment.");
        return response;
    }
}
