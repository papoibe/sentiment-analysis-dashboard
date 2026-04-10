package com.btl.sentiment_analysis_dashboard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.btl.sentiment_analysis_dashboard.dto.RegisterRequest;
import com.btl.sentiment_analysis_dashboard.dto.LoginRequest;
import com.btl.sentiment_analysis_dashboard.dto.AuthResponse;
import com.btl.sentiment_analysis_dashboard.dto.ApiResponse;
import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import com.btl.sentiment_analysis_dashboard.entity.User;
import com.btl.sentiment_analysis_dashboard.repository.UserRepository;
import com.btl.sentiment_analysis_dashboard.service.AuthService;
import com.btl.sentiment_analysis_dashboard.service.UserMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          UserMapper userMapper) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @PostMapping("/login") // Endpoint dang nhap - tra ve JWT token
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", authResponse));
    }

    @PostMapping("/register") // Endpoint dang ky tai khoan moi
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Đăng ký thành công", created));
    }

    // GET /auth/me - Lay thong tin user dang dang nhap tu JWT token
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe() {
        // Lay username tu SecurityContext (JWT filter da set truoc do)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        return ResponseEntity.ok(ApiResponse.success(userMapper.toResponse(user)));
    }
}
