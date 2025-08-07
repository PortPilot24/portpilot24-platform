package com.example.post.domain;

import java.time.LocalDateTime;

import com.example.post.dto.PostDTO;

import com.example.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Post {

    @Id
    @GeneratedValue
    @Column(name = "post_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private Boolean isNotice;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;


    // @Column
    // private int fileAttached;

    // @OneToMany(mappedBy = "postEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    // private List<PostFileEntity> postFileEntityList = new ArrayList<>();

    //첨부 파일이 없는경우 게시글에 사용되는 데이터만 담음.
    //파일 정보를 제외한 게시글 정보를 담는 엔티티를 생성하고 PostDTO의 정보를 해당 엔티티에 담는 함수
//    public static Post noFilePostEntity(PostDTO postDTO){
//        Post noFilePostEntity = new Post();
//
//        noFilePostEntity.setUser(postDTO.getUser());
//        noFilePostEntity.setTitle(postDTO.getTitle());
//        noFilePostEntity.setContent(postDTO.getContent());
//        noFilePostEntity.setIsNotice(postDTO.getIsNotice());
//        noFilePostEntity.setCreatedAt(postDTO.getCreatedAt());
//        noFilePostEntity.setUpdatedAt(noFilePostEntity.getUpdatedAt());
//
//        //파일 업로드 유무
//        // noFilePostEntity.setFileAttached(0);
//
//        return noFilePostEntity;
//    }

    //첨부 파일이 있는 경우 첨부 파일이 있는지 유무를 확인하는 변수를 추가로 담음
    //데이터베이스로 들어갈 데이터를 담을 객체를 만드는 함수
    // +)주석 사유: 파일 첨부 기능을 따로 뺄것, 여기에서 파일을 고려할 이유 없음
    // public static PostEntity filePostEntity(PostDTO postDTO){
    //     PostEntity filePostEntity = new PostEntity();
        
    //     filePostEntity.setUserId(postDTO.getUserId());
    //     filePostEntity.setName(postDTO.getName());
    //     filePostEntity.setTitle(postDTO.getTitle());
    //     filePostEntity.setContent(postDTO.getContent());
    //     filePostEntity.setIsNotice(postDTO.getIsNotice());
    //     filePostEntity.setCreatedAt(postDTO.getCreatedAt());
    //     filePostEntity.setUpdatedAt(filePostEntity.getUpdatedAt());

    //     //파일 업로드 유무
    //     filePostEntity.setFileAttached(1);

    //     return filePostEntity;
        
    // }

    // public static PostEntity toPostEntity(
    //  String title, String content, Boolean is_Notice, LocalDateTime created_At, LocalDateTime updated_At){
    //     PostEntity toPostEntity = new PostEntity();
    //     toPostEntity.setTitle(title);
    //     toPostEntity.setContent(content);
    //     toPostEntity.setIsNotice(is_Notice);
    //     toPostEntity.setCreatedAt(created_At);
    //     toPostEntity.setUpdatedAt(updated_At);
    //     // toPostEntity.getPostFileEntityList().add(postFileEntity);

    //     return toPostEntity;
    // }

    public static Post pageEntity(PostDTO postDTO){
        Post pagePostEntity = new Post();

        pagePostEntity.setId(postDTO.getId());
        pagePostEntity.setTitle(postDTO.getTitle());
        pagePostEntity.setCreatedAt(postDTO.getCreatedAt());
        
        return pagePostEntity;
    }

    
}