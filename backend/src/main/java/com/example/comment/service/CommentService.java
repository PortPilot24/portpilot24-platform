package com.example.comment.service;

import com.example.post.domain.Post;
import com.example.post.repository.PostRepository;
import com.example.comment.domain.Comment;
import com.example.comment.repository.CommentRepository;
import com.example.user.domain.User;

import com.example.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository PostRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository PostRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.PostRepository = PostRepository;
        this.userRepository = userRepository;
    }

    /**
     * 댓글 작성
     */
    public Comment createComment(Long postId, Long userId, String content) {
        Post post = PostRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        Comment comment = new Comment(post, user, content);
        return commentRepository.save(comment);
    }

    /**
     * 특정 게시글의 모든 댓글 조회
     */
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    /**
     * 댓글 수정 (작성자 본인만 가능)
     */
    @Transactional
    public void updateComment(Long commentId, String newContent, User user) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getUserId().equals(user.getUserId())) {
            throw new SecurityException("댓글 수정 권한이 없습니다.");
        }

        comment.updateContent(newContent);
    }

    /**
     * 댓글 삭제 (작성자 본인만 가능)
     */
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getUserId().equals(user.getUserId())) {
            throw new SecurityException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    public void deleteCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
        commentRepository.delete(comment);
    }
}
