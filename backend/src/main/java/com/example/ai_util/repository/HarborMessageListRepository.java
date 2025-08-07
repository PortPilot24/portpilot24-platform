package com.example.ai_util.repository;

import com.example.ai_util.domain.HarborMessageList;
import com.example.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HarborMessageListRepository extends JpaRepository<HarborMessageList, Long> {
    // 사용자의 모든 대화 목록을 최신순으로 조회
    List<HarborMessageList> findByUserIdOrderByCreatedAtDesc(User user);
}