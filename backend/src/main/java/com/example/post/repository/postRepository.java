package com.example.post.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.post.domain.PostEntity;

@Repository
public interface postRepository extends JpaRepository<PostEntity, Long> {
}
