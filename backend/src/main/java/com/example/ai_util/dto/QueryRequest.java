package com.example.ai_util.dto;

import lombok.Data;

@Data
public class QueryRequest {
    private String query;

    public QueryRequest(String query) {
        this.query = query;
    }
}



