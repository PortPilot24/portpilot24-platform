package com.example.ai_util.dto;

import com.example.ai_util.domain.HarborMessageList;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 대화 목록 조회 시 사용될 DTO
 */
@Data
@Builder
public class ConversationDTO {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ConversationDTO fromEntity(HarborMessageList entity) {
        return ConversationDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}