package com.example.ai_util.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "harbor_message")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HarborMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "harbor_message_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "harbor_message_list_id", nullable = false)
    private HarborMessageList harborMessageListId;

    @Column(name = "query", nullable = false, length = 300)
    private String query;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "iterations", nullable = false)
    private Long iterations;

    @Column(name = "tool_calls", columnDefinition = "TEXT")
    @Convert(converter = ToolCallListConverter.class)
    private List<ToolCall> toolCalls;

    @Column(name = "version", nullable = false)
    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
