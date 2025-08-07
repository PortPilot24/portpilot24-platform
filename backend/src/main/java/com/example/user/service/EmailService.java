package com.example.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final MailService mailService;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "비밀번호 재설정 안내";
        String content = """
            <p>아래 링크를 클릭해 비밀번호를 재설정하세요:</p>
            <a href="%s">비밀번호 재설정</a>
            <p>해당 링크는 30분 후 만료됩니다.</p>
        """.formatted(resetLink);

        mailService.send(toEmail, subject, content); // JavaMailSender 또는 외부 서비스 사용
    }
}
