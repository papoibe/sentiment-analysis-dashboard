package com.btl.sentiment_analysis_dashboard.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.btl.sentiment_analysis_dashboard.entity.User;
import com.btl.sentiment_analysis_dashboard.repository.UserRepository;

@Service // Đăng ký bean để Spring inject được vào các class khác
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm user theo username, nếu không có thì thử tìm theo email
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username).orElse(null));
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        // Trả về UserDetails của Spring Security (không phải entity User)
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }

}
