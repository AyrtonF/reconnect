package com.nassau.reconnect.models;
import com.nassau.reconnect.models.enums.AchievementType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private StudentCourse course;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer points;

    private LocalDateTime earnedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AchievementType type;

    private String icon;
}