package com.btl.sentiment_analysis_dashboard.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.btl.sentiment_analysis_dashboard.dto.RegisterRequest;
import com.btl.sentiment_analysis_dashboard.dto.LoginRequest;
import com.btl.sentiment_analysis_dashboard.dto.AuthResponse;
import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import com.btl.sentiment_analysis_dashboard.entity.Role;
import com.btl.sentiment_analysis_dashboard.entity.User;
import com.btl.sentiment_analysis_dashboard.exception.DuplicateResourceException;
import com.btl.sentiment_analysis_dashboard.repository.UserRepository;
import com.btl.sentiment_analysis_dashboard.security.JwtService;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    /**
     * Đăng nhập - xác thực username/password rồi trả JWT token
     */
    public AuthResponse login(LoginRequest request) {
        // Xác thực qua Spring Security AuthenticationManager
        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.usernameOrEmail(), request.password()));

        // Load user details để tạo token
        var userDetails = userDetailsService.loadUserByUsername(request.usernameOrEmail());
        String accessToken = jwtService.generateAccessToken(userDetails); // Tạo JWT access token

        // Lấy thông tin user từ database
        User user = userRepository.findByUsername(request.usernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.usernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User không tồn tại")));

        log.info("Đăng nhập thành công: {}", user.getUsername());

        return new AuthResponse(
                accessToken,
                "Bearer",
                900000, // 15 phút (khớp với application.yaml)
                userMapper.toResponse(user));
    }

    public UserResponse register(RegisterRequest request) {
        // Kiểm tra trùng lặp username
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username đã tồn tại");
        }
        // Kiểm tra trùng lặp email
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email đã tồn tại");
        }

        // Tạo user mới bằng Builder pattern
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password())) // Mã hóa mật khẩu bằng BCrypt
                .role(Role.ANALYST) // Mac dinh role la ANALYST khi dang ky
                .build();

        User savedUser = userRepository.save(user); // Lưu user vào database
        log.info("Đã tạo tài khoản: {}", savedUser.getUsername());

        return userMapper.toResponse(savedUser); // Chuyển entity sang DTO response
    }

}
