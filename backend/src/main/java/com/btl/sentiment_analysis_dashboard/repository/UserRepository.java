package com.btl.sentiment_analysis_dashboard.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.btl.sentiment_analysis_dashboard.entity.Role;
import com.btl.sentiment_analysis_dashboard.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // query derivation: phát sinh truy vấn từ tên method
    // dành cho method: không có @Query
    // findByUsername
    // cơ chế: Spring Data JPA sẽ phân tích tên method, tìm phần sau "findBy" →
    // "Username"
    // findby... -> select, điều kiện theo thuộc tiunhs sau "by"
    // existBy... -> Kiểm tra tồn tại (COUNT / EXISTS)
    // ...andIdNot -> thêm điều kiện "AND id != ?"
    // không cần viết câu lệnh truy vấn, chỉ cần đặt tên method đúng quy tắc =>
    // spring data JPA sẽ implement
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email); // Kiểm tra email đã tồn tại chưa
    // tìm kiếm theo search (username hoặc email chứa chuỗi input) và role
    // ứng với Get /api/users?search=...&role=...

    @Query("SELECT u FROM User u WHERE " +
            "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) "
            +
            "AND (:role IS NULL OR u.role = :role)")

    Page<User> findAllBySearchAndRole(@Param("search") String search, @Param("role") Role role, Pageable pageable);

}
