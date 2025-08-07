package com.example.post.controller;

import com.example.post.domain.PostFile;
import com.example.post.repository.PostFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostFileController {

    private final PostFileRepository postFileRepository;

    @GetMapping("/attachments/{storedFileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String storedFileName) {
        // 1. DB에서 파일 정보 조회
        PostFile postFile = postFileRepository.findByStoredFilename(storedFileName)
                .orElseThrow(() -> new RuntimeException("File not found: " + storedFileName));

        // 2. 파일을 Resource로 읽기
        File file = new File(postFile.getFilePath());
        if (!file.exists()) {
            throw new RuntimeException("Stored file does not exist: " + postFile.getFilePath());
        }

        Resource resource = new FileSystemResource(file);

        // 3. 응답 헤더 설정
        String encodedFileName;
        try {
            encodedFileName = URLEncoder.encode(postFile.getOriginalFilename(), "UTF-8")
                    .replaceAll("\\+", "%20");  // 공백 처리
        } catch (UnsupportedEncodingException e) {
            encodedFileName = postFile.getOriginalFilename();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}

