package com.example.user.service;

import com.example.user.domain.PasswordResetToken;
import com.example.user.dto.PasswordResetDto;
import com.example.user.dto.UserDto;
import com.example.user.domain.User;
import com.example.user.exception.BusinessException;
import com.example.user.exception.ErrorCode;
import com.example.user.repository.PasswordResetTokenRepository;
import com.example.user.repository.UserRepository;
import com.example.utils.MaskingUtils;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.example.user.service.LoginAuditService;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final LoginAuditService loginAuditService;

    private static final String PASSWORD_REGEX = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,16}$";

    @Transactional
    public UserDto.SignupResponse signup(UserDto.SignupRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 약관 동의 확인
        if (!request.getAgreeTerms()) {
            throw new BusinessException(ErrorCode.TERMS_NOT_AGREED);
        }

        // 비밀번호 형식 검증
        validatePasswordStrength(request.getPassword());

        // 사용자 생성
    User user = User.createForSignup(
            request.getEmail(),
            request.getName(),
            passwordEncoder.encode(request.getPassword()),
            User.Role.USER,
            request.getAffiliation(),
            request.getAgreeTerms()
    );

    try {
        User savedUser = userRepository.save(user);
        return UserDto.SignupResponse.builder()
                .id(savedUser.getUserId())
                .email(savedUser.getEmail())
                .build();
    } catch (DataIntegrityViolationException e) {
        throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
    }
    }

    private void validatePasswordStrength(String password) {
        if (password == null || !password.matches(PASSWORD_REGEX)) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }
    }

    // public UserDto.LoginResponse login(UserDto.LoginRequest request) {
    //     // 인증 처리
    //     authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    //     User user = userRepository.findByEmail(request.getEmail())
    //             .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

    //     // 관리자가 가입 승인을 해줘야 로그인 가능하게끔
    //     if (!user.getIsActive()) {
    //         throw new BusinessException(ErrorCode.USER_NOT_ACTIVE);
    //     }

    //     // JWT 토큰 생성
    //     UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
    //     String accessToken = jwtUtil.generateToken(userDetails);
    //     String refreshToken = jwtUtil.generateRefreshToken(userDetails);

    //     user.updateRefreshToken(refreshToken);
    //     userRepository.save(user);

    //     return UserDto.LoginResponse.builder()
    //             .accessToken(accessToken)
    //             .refreshToken(refreshToken)
    //             .build();
    // }

@Transactional
public UserDto.LoginResponse login(UserDto.LoginRequest request) {
    final int MAX_FAILS = 5;
    final int LOCK_MINUTES = 15;

    final String email = request.getEmail();
    final String raw = request.getPassword();

    // 선잠금 체크(존재 시에만)
    userRepository.findByEmail(email).ifPresent(u -> {
        if (u.isLockedNow()) throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
    });

    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, raw)
        );
    } catch (LockedException | BadCredentialsException | UsernameNotFoundException
             | InternalAuthenticationServiceException e) {

        // 존재하는 계정만 카운트 증가
        if (userRepository.findByEmail(email).isPresent()) {
            int count = loginAuditService.failAndGetCount(email); // ← REQUIRES_NEW
            if (count >= MAX_FAILS) {
                loginAuditService.lock(email, LOCK_MINUTES);       // ← REQUIRES_NEW
            }
        }
        throw new BusinessException(ErrorCode.AUTHENTICATION_FAILED);
    }

    // 성공 → 리셋 (REQUIRES_NEW)
    loginAuditService.reset(email);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BusinessException(ErrorCode.AUTHENTICATION_FAILED));

    if (!user.getIsActive()) {
        throw new BusinessException(ErrorCode.USER_NOT_ACTIVE);
    }

    UserDetails ud = userDetailsService.loadUserByUsername(email);
    String access = jwtUtil.generateToken(ud);
    String refresh = jwtUtil.generateRefreshToken(ud);

    user.updateRefreshToken(refresh);
    userRepository.save(user);

    return UserDto.LoginResponse.builder()
            .accessToken(access)
            .refreshToken(refresh)
            .build();
}

    @Transactional
    public UserDto.LoginResponse refreshToken(UserDto.RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            if (!jwtUtil.validateToken(refreshToken)) {
                throw new BusinessException(ErrorCode.INVALID_TOKEN);
            }

            String email = jwtUtil.getUsernameFromToken(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            if (!refreshToken.equals(user.getRefreshToken())) {
                throw new BusinessException(ErrorCode.INVALID_TOKEN);
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String newAccessToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

            user.updateRefreshToken(newRefreshToken);
            userRepository.save(user); // 이 시점에 버전 충돌이 감지될 수 있습니다.

            return UserDto.LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();
        } catch (OptimisticLockException e) { // 또는 ObjectOptimisticLockingFailureException
            // 여러 요청이 동시에 토큰 재발급을 시도하여 충돌이 발생한 경우
            log.warn("리프레시 토큰 재발급 중 동시성 충돌 발생: {}", request.getRefreshToken());
            // 클라이언트에게 재시도 또는 이미 갱신되었을 수 있음을 알리는 에러를 보냅니다.
            throw new BusinessException(ErrorCode.CONCURRENT_REQUEST);
        }
    }

    @Transactional
    public UserDto.MessageResponse logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.updateRefreshToken(null); // 리프레시 토큰 삭제
        userRepository.save(user);

        return UserDto.MessageResponse.builder()
                .message("로그아웃 완료")
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto.UserInfo getUserInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return UserDto.UserInfo.builder()
                .id(user.getUserId())
                .email(MaskingUtils.maskEmail(user.getEmail()))
                .name(MaskingUtils.maskName(user.getName()))
                .role(user.getRole().name())
                .affiliation(user.getAffiliation())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserDto.UserListItem> getUserList(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(user -> UserDto.UserListItem.builder()
                        .id(user.getUserId())
                        .email(MaskingUtils.maskEmail(user.getEmail()))
                        .name(MaskingUtils.maskName(user.getName()))
                        .role(user.getRole())
                        .isActive(user.getIsActive())
                        .isTermsAgreed(user.getIsTermsAgreed())
                        .build());
    }

    @Transactional
    public UserDto.MessageResponse updateUserRole(Long userId, UserDto.RoleUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.updateRole(request.getRole());

        return UserDto.MessageResponse.builder()
                .message("수정 완료")
                .build();
    }

    @Transactional
    public UserDto.MessageResponse activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setIsActive(true); // 활성화 상태로 변경

        return UserDto.MessageResponse.builder()
                .message("사용자 활성화 완료")
                .build();
    }

    @Transactional
    public UserDto.MessageResponse inActivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setIsActive(false); // 활성화 상태로 변경

        return UserDto.MessageResponse.builder()
                .message("사용자 비활성화 완료")
                .build();
    }

    @Transactional
    public UserDto.MessageResponse deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user); // 사용자 삭제

        return UserDto.MessageResponse.builder()
                .message("사용자 삭제 완료")
                .build();
    }

    @Transactional
    public UserDto.MessageResponse changePassword(String email, UserDto.PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        return UserDto.MessageResponse.builder()
                .message("비밀번호 변경 완료")
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto.EmailCheckResponse checkEmailAvailability(String email) {
        if (email == null || email.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        log.info("Checking email availability for: {}", email);
        if (userRepository.existsByEmail(email)) {
            return UserDto.EmailCheckResponse.notAvailable();
        } else {
            return UserDto.EmailCheckResponse.available();
        }
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (!user.getIsActive()) {
            throw new BusinessException(ErrorCode.USER_NOT_ACTIVE);
        }
        return user;
    }

    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String token = UUID.randomUUID().toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(30);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .userId(user.getUserId())
                .expiresAt(expiration)
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = "https://protpilot-gaeqdhdxhvajagc8.z01.azurefd.net/reset-password?token=" + token;
        
// ${DOMAIN_NAME}
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink); // 아래에서 구현
    }

    @Transactional
    public void resetPassword(PasswordResetDto dto) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(dto.getToken())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_PASSWORD_RESET_TOKEN));

        if (token.isExpired()) {
            throw new BusinessException(ErrorCode.EXPIRED_PASSWORD_RESET_TOKEN);
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        validatePasswordStrength(dto.getNewPassword());

        user.updatePassword(passwordEncoder.encode(dto.getNewPassword()));

        passwordResetTokenRepository.delete(token);
    }

}
