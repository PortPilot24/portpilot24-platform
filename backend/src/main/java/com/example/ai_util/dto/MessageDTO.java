package com.example.ai_util.dto;

import com.example.ai_util.domain.HarborMessage;
import com.example.ai_util.domain.ToolCall;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 특정 대화의 메시지 조회 시 사용될 DTO
 */
@Data
@Builder
public class MessageDTO {
    private Long id;
    private String query;
    private String answer;
    private List<ToolCall> toolCalls;
    private LocalDateTime createdAt;

    public static MessageDTO fromEntity(HarborMessage entity) {
        return MessageDTO.builder()
                .id(entity.getId())
                .query(entity.getQuery())
                .answer(entity.getAnswer())
                .toolCalls(entity.getToolCalls())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}