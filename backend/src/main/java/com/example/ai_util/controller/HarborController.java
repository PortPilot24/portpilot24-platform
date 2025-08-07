package com.example.ai_util.controller;

import com.example.ai_util.dto.QueryRequest;
import com.example.ai_util.dto.QueryResponse;
import com.example.ai_util.dto.HealthResponse;
import com.example.ai_util.service.HarborAgentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/harbor")
@RequiredArgsConstructor
public class HarborController {

    private final HarborAgentService harborAgentService;

    /**
     * 항만 관련 질의 처리
     */
    @PostMapping("/query")
    public ResponseEntity<QueryResponse> processQuery(@RequestBody QueryRequest request) {
        try {
            String query = request.getQuery();
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            QueryResponse response = harborAgentService.processQuery(query);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("쿼리 처리 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * FastAPI 서버 상태 체크
     */
    @GetMapping("/health")
    public ResponseEntity<HealthResponse> checkHealth() {
        try {
            HealthResponse health = harborAgentService.checkHealth();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.status(503).build();
        }
    }

    /**
     * FastAPI 서버 상태 정보
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = harborAgentService.getServerStatus();
        return ResponseEntity.ok(status);
    }

    /**
     * 연결 상태 확인
     */
    @GetMapping("/connection")
    public ResponseEntity<Map<String, Boolean>> checkConnection() {
        boolean available = harborAgentService.isServerAvailable();
        return ResponseEntity.ok(Map.of("connected", available));
    }
}