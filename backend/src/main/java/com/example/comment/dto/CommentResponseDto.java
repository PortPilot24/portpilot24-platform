package com.example.comment.dto;

import java.time.LocalDateTime;
import com.example.comment.domain.Comment;

public class CommentResponseDto {

    private Long id;
    private String content;
    private String authorEmail;  // 또는 authorName
    private boolean isMine;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorName;

    public CommentResponseDto(Comment comment, Long currentUserId) {
        this.id = comment.getCommentId();
        this.content = comment.getContent();
        this.isMine = comment.getUserId().longValue() == currentUserId;
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }

    // Getter 추가 (Lombok 안 쓴 경우)
    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public boolean isMine() {
        return isMine;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getAuthorName() {
        return authorName;
    }
}
