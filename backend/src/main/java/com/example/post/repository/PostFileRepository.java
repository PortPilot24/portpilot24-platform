package com.example.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.post.domain.PostFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PostFileRepository extends JpaRepository<PostFile, Long> {
    PostFile findByPostId(Long postId);
    Optional<PostFile> findByStoredFilename(String storedFilename);

    @Modifying
    @Transactional
    @Query("DELETE FROM PostFile pf WHERE pf.post.id = :postId")
    void deleteByPostId(Long postId);
}
