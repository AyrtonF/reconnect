package com.nassau.reconnect.models;



import com.nassau.reconnect.models.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "institution_id")
    private Long institutionId;

    private String phone;

    private Integer score;

    private String avatar;

    @ManyToMany
    @JoinTable(
            name = "user_courses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<StudentCourse> courses = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_families",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "family_id")
    )
    private Set<Family> families = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_completed_challenges",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "challenge_id")
    )
    private Set<Challenge> completedChallenges = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_pending_challenges",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "challenge_id")
    )
    private Set<Challenge> pendingChallenges = new HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "user_challenge_images",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "image_path")
    private List<String> imagesOfChallenge = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_coupons",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "coupon_id")
    )
    private Set<Coupon> coupons = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private List<Post> posts = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}