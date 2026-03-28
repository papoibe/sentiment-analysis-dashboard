package com.btl.sentiment_analysis_dashboard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.btl.sentiment_analysis_dashboard.dto.RegisterRequest;
import com.btl.sentiment_analysis_dashboard.dto.LoginRequest;
import com.btl.sentiment_analysis_dashboard.dto.AuthResponse;
import com.btl.sentiment_analysis_dashboard.dto.ApiResponse;
import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import com.btl.sentiment_analysis_dashboard.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login") // Endpoint đăng nhập - trả về JWT token
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", authResponse));
    }

    @PostMapping("/register") // Endpoint đăng ký tài khoản mới
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Đăng ký thành công", created));
    }

}
