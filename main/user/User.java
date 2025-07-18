@Entity
public class User {
    @Id
    @GeneratedValue
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String passwordHash;
    private String role;
    private boolean isTermsAgreed;

    private LocalDateTime createdAt;

    // 연관 관계
    @OneToMany(mappedBy = "user")
    private List<Post> posts;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user")
    private List<LoginAttempt> loginAttempts;

    @OneToMany(mappedBy = "user")
    private List<PasswordResetToken> resetTokens;
}