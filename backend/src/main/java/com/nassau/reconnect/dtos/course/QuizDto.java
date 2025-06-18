package com.nassau.reconnect.dtos.course;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private Long id;
    private String title;
    private String description;
    private List<QuizQuestionDto> questions;
    private Integer timeLimit;
    private Integer minimumScore;
    private List<QuizAttemptDto> attempts;
    private boolean isCompleted;
    private Integer bestScore;
}