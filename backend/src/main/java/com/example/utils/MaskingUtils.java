package com.example.utils;

public class MaskingUtils {

    // 이름 마스킹: 마지막 글자 * 처리
    public static String maskName(String name) {
        if (name == null || name.length() < 2) return "*";
        return name.substring(0, name.length() - 1) + "*";
    }

    // 이메일 마스킹: @ 앞의 마지막 3글자 * 처리
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "";

        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];

        int unmaskedLength = Math.max(local.length() - 3, 0);
        String maskedLocal = local.substring(0, unmaskedLength) + "***";

        return maskedLocal + "@" + domain;
    }
}
