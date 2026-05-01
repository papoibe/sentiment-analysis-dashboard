package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.entity.Notification;
import com.btl.sentiment_analysis_dashboard.entity.User;
import com.btl.sentiment_analysis_dashboard.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

// Service xu ly logic thong bao — tao, doc, danh dau da doc
@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Tao thong bao moi — luu vao DB
    public Notification create(String title, String type, String targetRole) {
        Notification noti = Notification.builder()
                .title(title)
                .type(type != null ? type : "info")
                .targetRole(targetRole != null ? targetRole : "ALL")
                .channel("IN_APP")
                .sentAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(noti);
    }

    // Tao thong bao voi sender (Admin gui)
    public Notification create(String title, String type, String targetRole, User sender) {
        Notification noti = Notification.builder()
                .title(title)
                .type(type != null ? type : "info")
                .targetRole(targetRole != null ? targetRole : "ALL")
                .channel("IN_APP")
                .sender(sender)
                .sentAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(noti);
    }

    // Lay thong bao theo role — ALL + role cu the, sap xep moi nhat truoc
    public List<Notification> getForRole(String role) {
        List<Notification> all = notificationRepository.findAll();
        return all.stream()
                .filter(n -> "ALL".equals(n.getTargetRole())
                        || role.equals(n.getTargetRole()))
                .sorted((a, b) -> {
                    // Sap xep theo sentAt giam dan (moi nhat truoc)
                    LocalDateTime ta = a.getSentAt() != null ? a.getSentAt() : a.getCreatedAt();
                    LocalDateTime tb = b.getSentAt() != null ? b.getSentAt() : b.getCreatedAt();
                    return tb.compareTo(ta);
                })
                .limit(50) // Gioi han 50 thong bao gan nhat
                .toList();
    }

    // Dem so thong bao chua doc theo role
    public long countUnread(String role) {
        return getForRole(role).stream()
                .filter(n -> !Boolean.TRUE.equals(n.getIsRead()))
                .count();
    }

    // Danh dau 1 thong bao da doc
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    // Danh dau tat ca thong bao cua role da doc
    public void markAllAsRead(String role) {
        getForRole(role).stream()
                .filter(n -> !Boolean.TRUE.equals(n.getIsRead()))
                .forEach(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                });
    }

    // === Cac helper tao thong bao theo nghiep vu ===

    // Thong bao chao mung khi dang nhap
    public void createWelcome(User user) {
        create("Chào mừng " + user.getFullName() + " đăng nhập hệ thống!",
                "info", user.getRole().name());
    }

    // Thong bao tao user moi (gui cho ADMIN)
    public void notifyUserCreated(String username) {
        create("User " + username + " vừa được tạo", "info", "ADMIN");
    }

    // Thong bao xoa user (gui cho ADMIN)
    public void notifyUserDeleted(String username) {
        create("User " + username + " đã bị xóa", "warning", "ADMIN");
    }

    // Thong bao flag review (gui cho MANAGER)
    public void notifyReviewFlagged(Long reviewId, String priority) {
        create("Review #" + reviewId + " đã được flag " + priority,
                "warning", "MANAGER");
    }

    // Thong bao assign review (gui cho ANALYST)
    public void notifyReviewAssigned(Long reviewId, String assigneeName) {
        create("Review #" + reviewId + " được giao cho " + assigneeName,
                "info", "ANALYST");
    }

    // Thong bao tao datasource (gui cho MANAGER + ADMIN)
    public void notifyDataSourceCreated(String dsName) {
        create("Data source '" + dsName + "' đã được tạo", "info", "ALL");
    }

    // Thong bao import thanh cong (gui cho MANAGER)
    public void notifyImportCompleted(String dsName, int count) {
        create("Import " + count + " reviews từ " + dsName + " thành công",
                "info", "MANAGER");
    }

    // Thong bao export bao cao (gui cho ANALYST)
    public void notifyReportExported(String format) {
        create("Báo cáo " + format.toUpperCase() + " đã xuất thành công",
                "info", "ANALYST");
    }

    // Thong bao alert triggered (gui cho MANAGER + ADMIN)
    public void notifyAlertTriggered(String condition, int count, int threshold) {
        create("⚠️ Alert: " + count + " reviews " + condition + " vượt ngưỡng " + threshold + "!",
                "alert", "ALL");
    }
}
