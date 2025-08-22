package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "affiliation") // ✅ 소속 추가
    private String affiliation;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_terms_agreed", nullable = false)
    private Boolean isTermsAgreed;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    public enum Role {
        USER, ADMIN, ROOT

    }

    public void updateRole(Role role) {
        this.role = role;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void updatePassword(String encodedPassword) {
        this.passwordHash = encodedPassword;
    }

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;
    @Column(name = "lockout_until")
    private LocalDateTime lockoutUntil;
    @Column(name = "last_failed_login")
    private LocalDateTime lastFailedLogin;

        // ✅ 회원가입 전용 생성 팩토리
    public static User createForSignup(
            String email,
            String name,
            String passwordHash,
            Role role,
            String affiliation,
            boolean agreeTerms
    ) {
        User u = new User();
        u.email = email;
        u.name = name;
        u.passwordHash = passwordHash;
        u.role = role;
        u.affiliation = affiliation;
        u.isTermsAgreed = agreeTerms;
        u.isActive = false;                 // 기본: 미승인
        u.failedLoginAttempts = 0;          // 기본: 0
        return u;
    }


    public boolean isLockedNow() {
        return lockoutUntil != null && lockoutUntil.isAfter(LocalDateTime.now());
    }

}
