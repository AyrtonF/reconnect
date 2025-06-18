package com.nassau.reconnect.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "institution_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private InstitutionCourse course;

    @Column(nullable = false, length = 1000)
    private String question;

    @ElementCollection
    @CollectionTable(
            name = "institution_question_alternatives",
            joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "alternative")
    private List<String> alternatives = new ArrayList<>();

    @Column(nullable = false)
    private Integer correctAnswer;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}