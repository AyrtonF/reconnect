package com.nassau.reconnect.models;


import com.nassau.reconnect.models.enums.ChallengeStatus;
import com.nassau.reconnect.models.enums.ChallengeType;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "challenges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeStatus status;

    @ManyToMany(mappedBy = "pendingChallenges")
    private Set<User> participants = new HashSet<>();

    private String image;

    private String imageBanner;

    private Integer checks;

    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeType type;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;
}