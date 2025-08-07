package com.example.ai_util.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class HealthResponse {
    private String status;

    @JsonProperty("agent_status")
    private String agentStatus;

    @JsonProperty("api_version")
    private String apiVersion;
}
