package com.example.ai_util.service;

import com.example.ai_util.domain.HarborMessage;
import com.example.ai_util.domain.HarborMessageList;
import com.example.ai_util.domain.ToolCall;
import com.example.ai_util.dto.ConversationDTO;
import com.example.ai_util.dto.MessageDTO;
import com.example.ai_util.dto.QueryResponse;
import com.example.ai_util.repository.HarborMessageListRepository;
import com.example.ai_util.repository.HarborMessageRepository;
import com.example.user.domain.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 항만 메시지 데이터베이스 연동 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HarborPersistenceService {

    private final HarborMessageRepository harborMessageRepository;
    private final HarborMessageListRepository harborMessageListRepository;

    /**
     * 쿼리와 AI 응답을 데이터베이스에 저장합니다.
     * messageListId가 없으면 새로운 대화를 생성하고, 있으면 기존 대화에 메시지를 추가합니다.
     */
    @Transactional
    public HarborMessage saveMessage(User user, Long messageListId, String query, QueryResponse aiResponse) {
        // 1. 대화 목록 찾기 또는 생성하기
        HarborMessageList messageList = findOrCreateMessageList(user, messageListId);

        // 2. ToolCallDTO를 도메인 객체로 변환
        List<ToolCall> toolCalls = new ArrayList<>();
        if (aiResponse.getToolCalls() != null) {
            toolCalls = aiResponse.getToolCalls().stream()
                    .map(dto -> new ToolCall(dto.getTool(), dto.getSourceFile()))
                    .collect(Collectors.toList());
        }

        // 3. HarborMessage 엔티티 생성
        HarborMessage harborMessage = HarborMessage.builder()
                .harborMessageListId(messageList)
                .query(query)
                .answer(aiResponse.getAnswer())
                .iterations(aiResponse.getIterations() != null ? aiResponse.getIterations().longValue() : 0L)
                .toolCalls(toolCalls)
                .build();

        // 4. 메시지 저장
        HarborMessage savedMessage = harborMessageRepository.save(harborMessage);
        log.info("새 메시지 저장 완료. ID: {}, 대화 ID: {}", savedMessage.getId(), messageList.getId());

        // 5. 새 대화인 경우, 첫번째 질문으로 제목 자동 생성
        if (messageList.getTitle() == null) {
            String newTitle = query.substring(0, Math.min(query.length(), 50));
            messageList.setTitle(newTitle);
            harborMessageListRepository.save(messageList);
            log.info("새 대화 제목 설정: {}", newTitle);
        }

        return savedMessage;
    }

    private HarborMessageList findOrCreateMessageList(User user, Long messageListId) {
        if (messageListId != null) {
            // 기존 대화 찾기
            return harborMessageListRepository.findById(messageListId)
                    .orElseThrow(() -> new EntityNotFoundException("MessageList not found with id: " + messageListId));
        } else {
            // 새 대화 생성
            log.info("{} 사용자를 위한 새 대화 생성", user.getName());
            HarborMessageList newList = HarborMessageList.builder()
                    .userId(user)
                    .title(null) // 첫 메시지 저장 후 제목을 설정
                    .build();
            return harborMessageListRepository.save(newList);
        }
    }

    /**
     * 특정 사용자의 모든 대화 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<ConversationDTO> getConversationsForUser(User user) {
        log.info("{} 사용자의 대화 목록 조회", user.getName());
        return harborMessageListRepository.findByUserIdOrderByCreatedAtDesc(user)
                .stream()
                .map(ConversationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 대화에 속한 모든 메시지를 조회합니다.
     * 사용자가 해당 대화의 소유자인지 확인하는 보안 검사를 포함합니다.
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesForConversation(Long messageListId, User user) {
        log.info("대화 ID {}의 메시지 조회 (사용자: {})", messageListId, user.getName());
        HarborMessageList messageList = harborMessageListRepository.findById(messageListId)
                .orElseThrow(() -> new EntityNotFoundException("MessageList not found with id: " + messageListId));

        // 보안 검사: 요청한 사용자가 대화의 소유주가 맞는지 확인
        if (!messageList.getUserId().getUserId().equals(user.getUserId())) {
            log.warn("보안 위반: 사용자 {}가 소유하지 않은 대화(ID: {})에 접근 시도", user.getName(), messageListId);
            throw new SecurityException("User does not have access to this conversation.");
        }

        return harborMessageRepository.findByHarborMessageListIdOrderByCreatedAtAsc(messageList)
                .stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public HarborMessageList createMessageList(User user, String title) {
        HarborMessageList messageList = HarborMessageList.builder()
                .userId(user)
                .title(title)
                .build();
        return harborMessageListRepository.save(messageList);
    }
}