package com.nassau.reconnect.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_videos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private Integer duration;

    @Column(nullable = false)
    private String url;

    private String thumbnail;

    private boolean isWatched;

    private Integer watchedDuration;

    private LocalDateTime lastWatchedAt;
}