package com.example.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.post.domain.PostFile;

import java.util.Optional;

@Repository
public interface PostFileRepository extends JpaRepository<PostFile, Long> {
    PostFile findByPostId(Long postId);
    Optional<PostFile> findByStoredFilename(String storedFilename);
}
