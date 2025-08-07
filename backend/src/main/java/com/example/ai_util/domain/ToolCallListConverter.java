package com.example.ai_util.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Converter
public class ToolCallListConverter implements AttributeConverter<List<ToolCall>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ToolCall> attribute) {
        if (attribute == null) return "[]";
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not serialize ToolCall list", e);
        }
    }

    @Override
    public List<ToolCall> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return new ArrayList<>();
        try {
            return objectMapper.readValue(dbData,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ToolCall.class));
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not deserialize ToolCall list", e);
        }
    }
}