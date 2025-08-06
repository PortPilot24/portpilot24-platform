package com.example.post.dto;

import java.time.LocalDateTime;
import com.example.post.domain.Post;

import com.example.post.domain.PostFile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {

    private Long id;
    private Long userId;
    private String name;
    private String title;
    private String content;
    private Boolean isNotice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ 추가
    private Integer fileAttached; // 1: 첨부, 0: 없음
    private String originalFileName;
    private String serverFileName;

    // 파일업로드는 따로 뺄것
    // private MultipartFile postFile;
    // private String originalFileName;
    // private String serverFileName;
    // private int fileAttached;

    // 엔티티의 데이터를 DTO에 넣을때 사용할 함수
    public static PostDTO toPostDTO(Post post, PostFile postFile) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setUserId(post.getUser().getUserId());
        postDTO.setName(post.getUser().getName());
        postDTO.setTitle(post.getTitle());
        postDTO.setContent(post.getContent());
        postDTO.setIsNotice(post.getIsNotice());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());

        if (postFile != null) {
            postDTO.setFileAttached(1);
            postDTO.setOriginalFileName(postFile.getOriginalFilename());
            postDTO.setServerFileName(postFile.getStoredFilename());
        } else {
            postDTO.setFileAttached(0);
        }

        // 첨부파일 유무를 확인하던 함수.
        // if(postEntity.getFileAttached() == 0){
        //     postDTO.setFileAttached(postEntity.getFileAttached());
        // }else{
        //     postDTO.setFileAttached(postEntity.getFileAttached());
        //     postDTO.setOriginalFileName(postEntity.getPostFileEntityList().get(0).getOriginalFileName());
        //     postDTO.setServerFileName(postEntity.getPostFileEntityList().get(0).getSavedFileName());
        // }

        return postDTO;
    }

    
}
