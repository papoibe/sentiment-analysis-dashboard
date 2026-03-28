package com.btl.sentiment_analysis_dashboard.service;

import org.springframework.stereotype.Component;

import com.btl.sentiment_analysis_dashboard.dto.UserResponse;
import com.btl.sentiment_analysis_dashboard.entity.User;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        if (user == null)
            return null;

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getFullName(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}