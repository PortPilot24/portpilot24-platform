package com.example.ai_util.service;

import com.example.ai_util.dto.QueryRequest;
import com.example.ai_util.dto.QueryResponse;
import com.example.ai_util.dto.HealthResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpServerErrorException;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class HarborAgentService {

    private final RestTemplate restTemplate;

    @Value("${harbor.fastapi.base-url}")
    private String baseUrl;

    @Value("${harbor.fastapi.timeout:30000}")
    private int timeout;

    public HarborAgentService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostConstruct
    public void init() {
        log.info("HarborAgentService 초기화 완료. BaseURL: {}", baseUrl);

        // 서버 시작 시 FastAPI 연결 상태 확인
        try {
            HealthResponse health = checkHealth();
            log.info("FastAPI 서버 연결 성공: {}", health.getStatus());
        } catch (Exception e) {
            log.warn("FastAPI 서버 연결 실패: {}", e.getMessage());
        }
    }

    /**
     * FastAPI 헬스체크
     */
    public HealthResponse checkHealth() {
        try {
            String url = baseUrl + "/health";
            ResponseEntity<HealthResponse> response = restTemplate.getForEntity(url, HealthResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                log.debug("FastAPI 헬스체크 성공");
                return response.getBody();
            } else {
                throw new RuntimeException("FastAPI 서버 응답 상태 코드: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("FastAPI 헬스체크 실패: {}", e.getMessage());
            throw new RuntimeException("FastAPI 서버에 연결할 수 없습니다", e);
        }
    }

    /**
     * FastAPI에 쿼리 전송 (재시도 로직 포함)
     */
    @Retryable(
            value = {ResourceAccessException.class, HttpServerErrorException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public QueryResponse processQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("쿼리가 비어있습니다");
        }

        try {
            log.info("FastAPI에 쿼리 전송: {}", query.substring(0, Math.min(query.length(), 50)) + "...");

            String url = baseUrl + "/query";

            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 요청 객체 생성
            QueryRequest request = new QueryRequest(query);
            HttpEntity<QueryRequest> entity = new HttpEntity<>(request, headers);

            // FastAPI 호출
            ResponseEntity<QueryResponse> response = restTemplate.postForEntity(url, entity, QueryResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                QueryResponse result = response.getBody();
                log.info("FastAPI 응답 수신 완료. 반복 횟수: {}", result.getIterations());
                return result;
            } else {
                throw new RuntimeException("FastAPI 서버 응답 오류: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("FastAPI 쿼리 처리 실패: {}", e.getMessage(), e);
            throw new RuntimeException("쿼리 처리 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * FastAPI 서버 상태 확인
     */
    public Map<String, Object> getServerStatus() {
        try {
            String url = baseUrl + "/status";
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("상태 조회 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("FastAPI 서버 상태 조회 실패: {}", e.getMessage());

            Map<String, Object> errorStatus = new HashMap<>();
            errorStatus.put("server", "disconnected");
            errorStatus.put("error", e.getMessage());
            return errorStatus;
        }
    }

    /**
     * FastAPI 서버 연결 가능 여부 체크
     */
    public boolean isServerAvailable() {
        try {
            checkHealth();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}