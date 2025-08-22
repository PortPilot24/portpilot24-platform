package com.example.user.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        log.warn("Business exception: {}", e.getErrorCode(), e);
        int status = e.getErrorCode().getStatus(); // int 반환 전제
        ErrorResponse body = ErrorResponse.builder()
                .status(status)
                .message(e.getErrorCode().getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.valueOf(status)).body(body);
    }

    // ✅ 인증 실패 계열 → 401
    @ExceptionHandler({
            BadCredentialsException.class,
            UsernameNotFoundException.class,
            LockedException.class,
            InternalAuthenticationServiceException.class,
            AuthenticationException.class
    })
    public ResponseEntity<ErrorResponse> handleAuthExceptions(Exception e) {
        log.warn("Authentication exception: {}", e.getClass().getSimpleName(), e);
        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("아이디 또는 비밀번호가 올바르지 않습니다.")
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    // 인가 실패 → 403
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        log.warn("Access denied: {}", e.getMessage());
        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("접근 권한이 없습니다.")
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // 잘못된 요청 → 400
    @ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentNotValidException.class })
    public ResponseEntity<ErrorResponse> handleBadRequest(Exception e) {
        log.warn("Bad request: {}", e.getMessage());
        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("요청 형식이 올바르지 않습니다.")
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // 나머지 → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        log.error("Unexpected exception", e);
        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("서버 내부 오류가 발생했습니다.")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
