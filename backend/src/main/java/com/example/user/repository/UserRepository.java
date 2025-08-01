package com.example.user.repository;

import com.example.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
//    Page<User> findAll(Pageable pageable);

    // 사용자 ID로 사용자 조회
//    Optional<User> findById(Long userId);
}
