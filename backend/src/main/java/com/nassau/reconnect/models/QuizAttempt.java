package com.nassau.reconnect.models;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private Integer score;

    @ElementCollection
    @CollectionTable(
            name = "quiz_attempt_answers",
            joinColumns = @JoinColumn(name = "attempt_id")
    )
    private List<Answer> answers = new ArrayList<>();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Answer {
        private Long questionId;
        private String answer;
        private boolean isCorrect;
    }
}