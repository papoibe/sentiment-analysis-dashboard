package com.btl.sentiment_analysis_dashboard.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import tools.jackson.databind.ObjectMapper; // Jackson 3.x (Spring Boot 4.x) dung package tools.jackson

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ObjectMapper objectMapper) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.objectMapper = objectMapper;
    }

    // Security filter chain rieng cho H2 Console - xu ly TRUOC filterChain chinh
    @Bean
    @Order(1) // Uu tien cao nhat - xu ly truoc cac filter chain khac
    public SecurityFilterChain h2ConsoleSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/h2-console/**") // Chi ap dung cho H2 Console paths
                .csrf(csrf -> csrf.disable()) // H2 Console can tat CSRF
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // H2 Console dung iframe
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Cho phep truy cap tu do
        return http.build();
    }

    @Bean
    @Order(2) // Filter chain chinh cho API
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tat CSRF cho REST API
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Khong dung session, dung JWT
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - khong can xac thuc
                        .requestMatchers("/api/auth/**", "/api/v1/auth/**").permitAll()
                        // Swagger UI - tat ca paths lien quan
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-resources/**").permitAll()
                        .requestMatchers("/webjars/**").permitAll()
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Analyst endpoints - chi ANALYST va cao hon
                        .requestMatchers("/api/v1/dashboard/**").hasAnyRole("ANALYST", "MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/reviews/**")
                        .hasAnyRole("ANALYST", "MANAGER", "ADMIN")
                        .requestMatchers("/api/v1/reports/**").hasAnyRole("ANALYST", "MANAGER", "ADMIN")

                        // Manager endpoints - chi MANAGER va ADMIN
                        .requestMatchers("/api/v1/data-sources/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/reviews/*/flag").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/reviews/*/assign").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers("/api/v1/alerts/**").hasAnyRole("MANAGER", "ADMIN")

                        // Admin endpoints - chi ADMIN
                        .requestMatchers("/api/v1/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/businesses/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/keywords/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/config/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/notifications/**").hasRole("ADMIN")

                        // Tat ca cac request khac can xac thuc
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint(objectMapper))) // Xu ly loi 401
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Them JWT filter
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())); // Cho phep iframe

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Ma hoa mat khau bang BCrypt
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager(); // Lay AuthenticationManager tu Spring Security
    }

}
