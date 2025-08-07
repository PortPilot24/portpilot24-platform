package com.example.user.dto;

import lombok.Getter;

@Getter
public class PasswordResetDto {
    private String token;
    private String newPassword;
}
