package com.nassau.reconnect.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

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

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizQuestion> questions = new ArrayList<>();

    private Integer timeLimit;

    @Column(nullable = false)
    private Integer minimumScore;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizAttempt> attempts = new ArrayList<>();

    private boolean isCompleted;

    private Integer bestScore;
}