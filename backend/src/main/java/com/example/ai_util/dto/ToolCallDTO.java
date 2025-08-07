package com.example.ai_util.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ToolCallDTO {

    private String tool;

    @JsonProperty("source_file") // JSON의 snake_case를 Java의 camelCase에 매핑
    private String sourceFile;
}