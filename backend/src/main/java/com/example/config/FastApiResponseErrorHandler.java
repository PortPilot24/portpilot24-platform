package com.example.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Slf4j
public class FastApiResponseErrorHandler extends DefaultResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        HttpStatusCode statusCode = response.getStatusCode();
        return statusCode.is4xxClientError() || statusCode.is5xxServerError();
    }

    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        String body = "";
        try (InputStream inputStream = response.getBody()) {
            body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("응답 본문 읽기 실패: {}", e.getMessage());
        }

        log.error("FastAPI 오류 응답: {} - {}", response.getStatusCode(), body);

        throw new RuntimeException("FastAPI 서버 오류: " + response.getStatusCode() + " - " + body);
    }
}