package com.example.user.controller;


import com.example.user.dto.PasswordResetDto;
import com.example.user.dto.PasswordResetRequestDto;
import com.example.user.dto.UserDto;
import com.example.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/users/signup")
    public ResponseEntity<UserDto.SignupResponse> signup(@RequestBody UserDto.SignupRequest request) {
        UserDto.SignupResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/login")
    public ResponseEntity<UserDto.LoginResponse> login(@RequestBody UserDto.LoginRequest request) {
        UserDto.LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/logout")
    public ResponseEntity<UserDto.MessageResponse> logout(Authentication authentication) {
        String email = authentication.getName();
        UserDto.MessageResponse response = userService.logout(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/refresh")
    public ResponseEntity<UserDto.LoginResponse> refreshToken(@RequestBody UserDto.RefreshTokenRequest request) {
        UserDto.LoginResponse response = userService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserDto.UserInfo> getUserInfo(Authentication authentication) {
        String email = authentication.getName();
        UserDto.UserInfo response = userService.getUserInfo(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ROOT')") // /admin/users?page=0&size=10&sort=createdAt,desc
    public ResponseEntity<Page<UserDto.UserListItem>> getUserList(Pageable pageable) {
        Page<UserDto.UserListItem> response = userService.getUserList(pageable);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/users/{userId}/role")
    @PreAuthorize("hasRole('ROOT')")
    public ResponseEntity<UserDto.MessageResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UserDto.RoleUpdateRequest request) {
        UserDto.MessageResponse response = userService.updateUserRole(userId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/users/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ROOT')")
    public ResponseEntity<UserDto.MessageResponse> activateUser(
            @PathVariable Long userId) {
        UserDto.MessageResponse response = userService.activateUser(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/users/{userId}/inactivate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ROOT')")
    public ResponseEntity<UserDto.MessageResponse> inActivateUser(
            @PathVariable Long userId) {
        UserDto.MessageResponse response = userService.inActivateUser(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/password")
    public ResponseEntity<UserDto.MessageResponse> changePassword(
            Authentication authentication,
            @RequestBody UserDto.PasswordChangeRequest request) {
        String email = authentication.getName();
        UserDto.MessageResponse response = userService.changePassword(email, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/users/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ROOT')")
    public ResponseEntity<UserDto.MessageResponse> deleteUser(
            @PathVariable Long userId) {
        UserDto.MessageResponse response = userService.deleteUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/check-email")
    public ResponseEntity<UserDto.EmailCheckResponse> checkEmail(@RequestParam String email) {
        UserDto.EmailCheckResponse response = userService.checkEmailAvailability(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/reset-password/request")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody PasswordResetRequestDto dto) {
        userService.sendResetPasswordEmail(dto.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody PasswordResetDto dto) {
        userService.resetPassword(dto);
        return ResponseEntity.ok().build();
    }
}

/** todo : 할만한거
 * 추가 기능 목록
 * 1. otp, email 기반 비밀번호 재발급 기능 추가 1
 * 2. 사용자 활동 로그 기록 기능 추가 3
 * 3. 회원 탈퇴, 회원탈퇴시 데이터 처리 정책 추가 2
 * 4. 소셜 로그인 4
 * 5. Refresh Token 저장 위치 -> Redis로 변경
 **/