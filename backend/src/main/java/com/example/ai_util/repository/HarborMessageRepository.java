package com.example.ai_util.repository;

import com.example.ai_util.domain.HarborMessage;
import com.example.ai_util.domain.HarborMessageList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HarborMessageRepository extends JpaRepository<HarborMessage, Long> {
    // 특정 대화에 속한 모든 메시지를 시간순으로 조회
    List<HarborMessage> findByHarborMessageListIdOrderByCreatedAtAsc(HarborMessageList harborMessageList);
}
