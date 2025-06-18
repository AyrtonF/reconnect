package com.nassau.reconnect.models;


import com.nassau.reconnect.models.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false, length = 1000)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @ElementCollection
    @CollectionTable(
            name = "quiz_question_options",
            joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>();

    @Column(nullable = false)
    private String correctAnswer;

    @Column(nullable = false)
    private Integer points;
}