package com.btl.sentiment_analysis_dashboard.service;

import com.btl.sentiment_analysis_dashboard.dto.UserRequest;
import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import com.btl.sentiment_analysis_dashboard.entity.*;
import com.btl.sentiment_analysis_dashboard.exception.ResourceNotFoundException;
import com.btl.sentiment_analysis_dashboard.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

// Service xu ly logic CRUD cho User entity
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // Lay danh sach tat ca users
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    // Tao user moi (Admin tao truc tiep voi role chi dinh)
    public UserResponse create(UserRequest request) {
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(Role.valueOf(request.role().toUpperCase())) // Chuyen string thanh enum Role
                .build();
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    // Cap nhat thong tin user theo id
    public UserResponse update(Long id, UserRequest request) {
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
        return userMapper.toResponse(saved);
    }

    // Xoa user theo id
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User không tồn tại với id: " + id);
        }
        userRepository.deleteById(id);
    }
}
