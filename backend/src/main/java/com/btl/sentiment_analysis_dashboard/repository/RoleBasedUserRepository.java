package com.btl.sentiment_analysis_dashboard.repository;

import com.btl.sentiment_analysis_dashboard.entity.Role;
import com.btl.sentiment_analysis_dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Mo rong UserRepository - them method tim user theo role
public interface RoleBasedUserRepository {
    List<User> findByRole(Role role);
}
