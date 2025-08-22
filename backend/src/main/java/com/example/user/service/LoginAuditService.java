package com.example.user.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import com.example.user.repository.UserRepository;

// com.example.user.service.LoginAuditService
@Service
public class LoginAuditService {

    private final UserRepository userRepository;

    public LoginAuditService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 실패 1 증가 후 현재 실패횟수 반환 (같은 새 트랜잭션에서 Select까지)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int failAndGetCount(String email) {
        userRepository.incrementFailedAttemptsByEmail(email, LocalDateTime.now());
        // 같은 REQUIRES_NEW 안에서 읽어 최신값 확보(1차 캐시 영향 없음, 네이티브 Select)
        Integer cnt = userRepository.getFailCountByEmail(email);
        return (cnt == null ? 0 : cnt);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void lock(String email, int minutes) {
        userRepository.lockAccountByEmail(email, LocalDateTime.now().plusMinutes(minutes));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void reset(String email) {
        userRepository.resetLockoutByEmail(email);
    }
}
