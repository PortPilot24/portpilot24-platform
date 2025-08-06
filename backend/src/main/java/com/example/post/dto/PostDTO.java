package com.example.post.dto;

import java.time.LocalDateTime;
import com.example.post.domain.Post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {

    private Long id;
    private String name;
    private String title;
    private String content;
    private Boolean isNotice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 파일업로드는 따로 뺄것
    // private MultipartFile postFile;
    // private String originalFileName;
    // private String serverFileName;
    // private int fileAttached;

    // 엔티티의 데이터를 DTO에 넣을때 사용할 함수
    public static PostDTO toPostDTO(Post post){
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setName(post.getUser().getName());
        postDTO.setTitle(post.getTitle());
        postDTO.setContent(post.getContent());
        postDTO.setIsNotice(post.getIsNotice());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());

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
