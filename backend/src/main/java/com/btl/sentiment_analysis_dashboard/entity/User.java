package com.btl.sentiment_analysis_dashboard.entity;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;


@Entity
@Table(name = "users", indexes={
    @Index(name = "idx_users_username", columnList = "username", unique=true),
    @Index(name = "idx_users_email", columnList = "email", unique=true)
})

public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=50)
    private String username;
    
    @Column(name = "password_hash", nullable=false, unique=true, length=225)
    private String passwordHash;



    @Column(nullable=false, unique=true, length=100)
    private String email;



    @Column(name = "full_name", length=100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=20)
    private Role role;


    @Column(name = "created_at", nullable=false, updatable=false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;


    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }


     @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }


    //getter / setter cho tất cả properties
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }


    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static final class UserBuilder {
            private Long id;
            private String username;
            private String passwordHash;
            private String email;
            private String fullName;
            private Role role;
            private Instant createdAt;
            private Instant updatedAt;

    
            public UserBuilder id(Long id) {
                this.id = id;
                return this;
            }

            public UserBuilder username(String username) {
                this.username = username;
                return this;
            }

            public UserBuilder passwordHash(String passwordHash) {
                this.passwordHash = passwordHash;
                return this;
            }

            public UserBuilder email(String email) {
                this.email = email;
                return this;
            }

            public UserBuilder fullName(String fullName) {
                this.fullName = fullName;
                return this;
            }
            

            public UserBuilder role(Role role) {
                this.role = role;
                return this;
            }

            public UserBuilder createdAt(Instant createdAt) {
                this.createdAt = createdAt;
                return this;
            }

            public UserBuilder updatedAt(Instant updatedAt) {
                this.updatedAt = updatedAt;
                return this;
            }


            public User build() {
                User user = new User();
                user.setId(id); 
                user.setUsername(username);
                user.setPasswordHash(passwordHash);
                user.setEmail(email);
                user.setFullName(fullName);
                user.setRole(role);
                user.setCreatedAt(createdAt);
                user.setUpdatedAt(updatedAt);
                return user;
            }
        }

}
