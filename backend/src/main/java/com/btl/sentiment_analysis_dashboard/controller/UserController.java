package com.btl.sentiment_analysis_dashboard.controller;

import com.btl.sentiment_analysis_dashboard.dto.*;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import com.btl.sentiment_analysis_dashboard.repository.UserRepository;
import com.btl.sentiment_analysis_dashboard.service.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Controller cho Admin - Users CRUD (4 endpoints theo api-docs)
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /users - Danh sach tat ca users
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // POST /users - Tao user moi (Admin tao truc tiep)
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserRequest request) {
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(Role.valueOf(request.role().toUpperCase())) // Chuyen string thanh enum Role
                .build();
        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userMapper.toResponse(saved)));
    }

    // PUT /users/{id} - Cap nhat user
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id,
            @RequestBody UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại với id: " + id));
        if (request.username() != null)
            user.setUsername(request.username());
        if (request.email() != null)
            user.setEmail(request.email());
        if (request.fullName() != null)
            user.setFullName(request.fullName());
        if (request.role() != null)
            user.setRole(Role.valueOf(request.role().toUpperCase()));
        if (request.password() != null && !request.password().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(userMapper.toResponse(saved)));
    }

    // DELETE /users/{id} - Xoa user
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User không tồn tại với id: " + id);
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User đã được xóa"));
    }
}
