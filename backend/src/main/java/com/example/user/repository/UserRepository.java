package com.example.user.repository;

import com.example.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
// com.example.user.repository.UserRepository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

        @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        UPDATE users
        SET failed_login_attempts = failed_login_attempts + 1,
            last_failed_login = :now
        WHERE email = :email
        """, nativeQuery = true)
    int incrementFailedAttemptsByEmail(@Param("email") String email,
                                       @Param("now") LocalDateTime now);

    @Query(value = "SELECT failed_login_attempts FROM users WHERE email = :email", nativeQuery = true)
    Integer getFailCountByEmail(@Param("email") String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE users SET lockout_until = :lockUntil WHERE email = :email", nativeQuery = true)
    int lockAccountByEmail(@Param("email") String email,
                           @Param("lockUntil") LocalDateTime lockUntil);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = "UPDATE users SET failed_login_attempts = 0, lockout_until = NULL WHERE email = :email", nativeQuery = true)
    int resetLockoutByEmail(@Param("email") String email);
}

