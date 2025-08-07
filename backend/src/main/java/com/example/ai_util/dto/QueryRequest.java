package com.example.ai_util.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QueryRequest {
    private Long messageListId;

    private String query;

    public QueryRequest(String query) {
        this.query = query;
    }
}



