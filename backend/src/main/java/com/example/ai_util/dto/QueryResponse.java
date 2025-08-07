package com.example.ai_util.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class QueryResponse {
    private String answer;
    private String query;

    @JsonProperty("tool_calls")
    private List<ToolCallDTO> toolCalls; // 이 부분은 그대로 유지

    private Integer iterations;
    private Boolean success;
}