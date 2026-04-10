package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.dto.DashboardSummaryResponse;
import com.btl.sentiment_analysis_dashboard.dto.ReviewResponse;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

// Service xuat bao cao ra file Excel (.xlsx) va PDF (.pdf)
// Dung Apache POI cho Excel, OpenPDF cho PDF
@Service
public class ExportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // === EXPORT EXCEL ===
    // Tao file .xlsx voi 2 sheet: Summary va Reviews
    public byte[] exportExcel(List<ReviewResponse> reviews, DashboardSummaryResponse summary)
            throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // --- Sheet 1: Summary ---
            Sheet summarySheet = workbook.createSheet("Tổng Quan");

            // Style cho header
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            // Tieu de
            org.apache.poi.ss.usermodel.Row titleRow = summarySheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BÁO CÁO PHÂN TÍCH SENTIMENT");
            CellStyle titleStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleStyle.setFont(titleFont);
            titleCell.setCellStyle(titleStyle);

            // Du lieu summary
            if (summary != null) {
                String[][] summaryData = {
                        { "Tổng số reviews", String.valueOf(summary.totalReviews()) },
                        { "Positive", String.valueOf(summary.positiveCount()) },
                        { "Negative", String.valueOf(summary.negativeCount()) },
                        { "Neutral", String.valueOf(summary.neutralCount()) },
                        { "Tỷ lệ Positive (%)", String.format("%.1f", summary.positivePercentage()) },
                        { "Tỷ lệ Negative (%)", String.format("%.1f", summary.negativePercentage()) },
                        { "Tỷ lệ Neutral (%)", String.format("%.1f", summary.neutralPercentage()) },
                        { "Confidence trung bình", String.format("%.2f", summary.avgConfidenceScore()) }
                };
                for (int i = 0; i < summaryData.length; i++) {
                    org.apache.poi.ss.usermodel.Row row = summarySheet.createRow(i + 2);
                    row.createCell(0).setCellValue(summaryData[i][0]);
                    row.createCell(1).setCellValue(summaryData[i][1]);
                }
            }
            summarySheet.autoSizeColumn(0);
            summarySheet.autoSizeColumn(1);

            // --- Sheet 2: Reviews ---
            Sheet reviewSheet = workbook.createSheet("Reviews");
            // Header cot
            String[] headers = { "ID", "Nội dung", "Sentiment", "Confidence",
                    "Nguồn", "Trạng thái", "Ưu tiên", "Ngày tạo" };

            org.apache.poi.ss.usermodel.Row headerRow = reviewSheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Du lieu reviews
            for (int i = 0; i < reviews.size(); i++) {
                ReviewResponse r = reviews.get(i);
                org.apache.poi.ss.usermodel.Row row = reviewSheet.createRow(i + 1);
                row.createCell(0).setCellValue(r.id() != null ? r.id() : 0);
                row.createCell(1).setCellValue(truncate(r.content(), 200));
                row.createCell(2).setCellValue(r.sentiment() != null ? r.sentiment() : "N/A");
                row.createCell(3).setCellValue(r.confidenceScore() != null
                        ? String.format("%.2f", r.confidenceScore())
                        : "N/A");
                row.createCell(4).setCellValue(r.dataSourceName() != null ? r.dataSourceName() : "N/A");
                row.createCell(5).setCellValue(r.status() != null ? r.status() : "N/A");
                row.createCell(6).setCellValue(r.priority() != null ? r.priority() : "N/A");
                row.createCell(7).setCellValue(r.createdAt() != null ? r.createdAt().format(DATE_FMT) : "N/A");
            }

            // Auto-size cac cot (gioi han cot noi dung)
            for (int i = 0; i < headers.length; i++) {
                if (i == 1) {
                    reviewSheet.setColumnWidth(1, 60 * 256); // Cot noi dung rong 60 ky tu
                } else {
                    reviewSheet.autoSizeColumn(i);
                }
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    // === EXPORT PDF ===
    // Tao file .pdf voi tieu de, bang tong quan va bang chi tiet reviews
    public byte[] exportPdf(List<ReviewResponse> reviews, DashboardSummaryResponse summary)
            throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        // Khoi tao document PDF landscape (ngang) de du cho nhieu cot
        Document document = new Document(PageSize.A4.rotate(), 20, 20, 30, 30);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font dinh nghia
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 51, 102));
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
            Font labelFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font valueFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            // Tieu de
            Paragraph title = new Paragraph("BÁO CÁO PHÂN TÍCH SENTIMENT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(15);
            document.add(title);

            // Bang tong quan (2 cot)
            if (summary != null) {
                Paragraph summaryTitle = new Paragraph("TỔNG QUAN", labelFont);
                summaryTitle.setSpacingAfter(8);
                document.add(summaryTitle);

                PdfPTable summaryTable = new PdfPTable(4); // 4 cot: label-value-label-value
                summaryTable.setWidthPercentage(80);
                summaryTable.setSpacingAfter(15);

                addSummaryRow(summaryTable, "Tổng reviews", String.valueOf(summary.totalReviews()),
                        "Confidence TB", String.format("%.2f", summary.avgConfidenceScore()), labelFont, valueFont);
                addSummaryRow(summaryTable, "Positive", String.valueOf(summary.positiveCount()) + " ("
                        + String.format("%.1f%%", summary.positivePercentage()) + ")",
                        "Negative", String.valueOf(summary.negativeCount()) + " ("
                                + String.format("%.1f%%", summary.negativePercentage()) + ")",
                        labelFont, valueFont);

                document.add(summaryTable);
            }

            // Bang chi tiet reviews
            Paragraph detailTitle = new Paragraph("CHI TIẾT REVIEWS", labelFont);
            detailTitle.setSpacingAfter(8);
            document.add(detailTitle);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            // Ty le rong cot: ID, NoiDung, Sentiment, Confidence, Nguon, TrangThai, Ngay
            table.setWidths(new float[] { 1f, 6f, 2f, 2f, 2f, 2f, 2.5f });

            // Header
            Color headerBg = new Color(0, 51, 102);
            String[] colHeaders = { "ID", "Nội dung", "Sentiment", "Confidence", "Nguồn", "Trạng thái", "Ngày tạo" };
            for (String h : colHeaders) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(headerBg);
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Du lieu - gioi han 200 dong dau cho PDF
            int maxRows = Math.min(reviews.size(), 200);
            for (int i = 0; i < maxRows; i++) {
                ReviewResponse r = reviews.get(i);
                // Mau nen xen ke de de doc
                Color rowBg = (i % 2 == 0) ? Color.WHITE : new Color(240, 240, 245);

                addPdfCell(table, String.valueOf(r.id() != null ? r.id() : 0), cellFont, rowBg,
                        Element.ALIGN_CENTER);
                addPdfCell(table, truncate(r.content(), 120), cellFont, rowBg, Element.ALIGN_LEFT);
                addPdfCell(table, r.sentiment() != null ? r.sentiment() : "N/A", cellFont, rowBg,
                        Element.ALIGN_CENTER);
                addPdfCell(table,
                        r.confidenceScore() != null ? String.format("%.2f", r.confidenceScore()) : "N/A",
                        cellFont, rowBg, Element.ALIGN_CENTER);
                addPdfCell(table, r.dataSourceName() != null ? r.dataSourceName() : "N/A", cellFont, rowBg,
                        Element.ALIGN_CENTER);
                addPdfCell(table, r.status() != null ? r.status() : "N/A", cellFont, rowBg, Element.ALIGN_CENTER);
                addPdfCell(table, r.createdAt() != null ? r.createdAt().format(DATE_FMT) : "N/A",
                        cellFont, rowBg, Element.ALIGN_CENTER);
            }

            document.add(table);

            // Footer
            if (reviews.size() > 200) {
                Paragraph note = new Paragraph(
                        "* Chỉ hiển thị 200/" + reviews.size() + " reviews đầu tiên", cellFont);
                note.setSpacingBefore(5);
                document.add(note);
            }

            Paragraph footer = new Paragraph(
                    "Xuất bởi: Sentiment Analysis Dashboard | Ngày: "
                            + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    cellFont);
            footer.setAlignment(Element.ALIGN_RIGHT);
            footer.setSpacingBefore(10);
            document.add(footer);

        } finally {
            document.close();
        }
        return out.toByteArray();
    }

    // Helper: them 1 dong vao bang summary PDF (4 cot)
    private void addSummaryRow(PdfPTable table, String label1, String value1,
            String label2, String value2, Font labelFont, Font valueFont) {
        PdfPCell l1 = new PdfPCell(new Phrase(label1, labelFont));
        l1.setBorder(0);
        l1.setPadding(4);
        table.addCell(l1);

        PdfPCell v1 = new PdfPCell(new Phrase(value1, valueFont));
        v1.setBorder(0);
        v1.setPadding(4);
        table.addCell(v1);

        PdfPCell l2 = new PdfPCell(new Phrase(label2, labelFont));
        l2.setBorder(0);
        l2.setPadding(4);
        table.addCell(l2);

        PdfPCell v2 = new PdfPCell(new Phrase(value2, valueFont));
        v2.setBorder(0);
        v2.setPadding(4);
        table.addCell(v2);
    }

    // Helper: them 1 cell vao bang reviews PDF
    private void addPdfCell(PdfPTable table, String text, Font font, Color bgColor, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(4);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }

    // Helper: cat gon noi dung neu qua dai
    private String truncate(String text, int maxLength) {
        if (text == null)
            return "";
        return text.length() > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
}
