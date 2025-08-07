package com.example.ai_util.controller;

import com.example.ai_util.domain.HarborMessage;
import com.example.ai_util.domain.HarborMessageList;
import com.example.ai_util.dto.*;
import com.example.ai_util.service.HarborAgentService;
import com.example.ai_util.service.HarborPersistenceService;
import com.example.user.domain.User;
import com.example.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/harbor")
@RequiredArgsConstructor
public class HarborController {

    private final HarborAgentService harborAgentService;
    private final HarborPersistenceService harborPersistenceService;
    private final UserService userService; // 데모용 사용자 조회


    /**
     * 항만 관련 질의 처리 및 대화 내용 저장
     */
    @PostMapping("/query")
    public ResponseEntity<QueryResponse> processQuery(@RequestBody QueryRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            String query = request.getQuery();
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // 1. FastAPI 에이전트로부터 AI 응답 받기
            QueryResponse aiResponse = harborAgentService.processQuery(query);


            // 3. 쿼리와 응답을 DB에 저장하기
            HarborMessage savedMessage = harborPersistenceService.saveMessage(
                    user,
                    request.getMessageListId(),
                    query,
                    aiResponse
            );

            // 4. 클라이언트에게 보낼 응답에 DB ID 정보 추가하기
            aiResponse.setMessageListId(savedMessage.getHarborMessageListId().getId());
            aiResponse.setMessageId(savedMessage.getId());

            return ResponseEntity.ok(aiResponse);

        } catch (Exception e) {
            log.error("쿼리 처리 중 심각한 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 현재 사용자의 모든 대화 목록을 조회
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            List<ConversationDTO> conversations = harborPersistenceService.getConversationsForUser(user);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            log.error("대화 목록 조회 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 특정 대화에 속한 모든 메시지를 조회
     * @param messageId 조회할 대화의 ID
     */
    @GetMapping("/conversations/{messageId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long messageId,Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            List<MessageDTO> messages = harborPersistenceService.getMessagesForConversation(messageId, user);
            return ResponseEntity.ok(messages);
        } catch (EntityNotFoundException e) {
            log.warn("메시지 조회 실패 (찾을 수 없음): {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            log.warn("메시지 조회 보안 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            log.error("메시지 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/conversation/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            harborPersistenceService.deleteMessage(messageId, user);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            log.warn("메시지 삭제 실패 (찾을 수 없음): {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            log.warn("메시지 삭제 보안 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            log.error("메시지 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/conversations/{listId}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long listId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            harborPersistenceService.deleteMessageList(listId, user);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            log.warn("대화 삭제 실패 (찾을 수 없음): {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            log.warn("대화 삭제 보안 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            log.error("대화 삭제 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }

    }


    @GetMapping("/health")
    public ResponseEntity<HealthResponse> checkHealth() {
        try {
            HealthResponse health = harborAgentService.checkHealth();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.status(503).build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = harborAgentService.getServerStatus();
        return ResponseEntity.ok(status);
    }

    @GetMapping("/connection")
    public ResponseEntity<Map<String, Boolean>> checkConnection() {
        boolean available = harborAgentService.isServerAvailable();
        return ResponseEntity.ok(Map.of("connected", available));
    }
}
