package com.nassau.reconnect.dtos.course;


import com.nassau.reconnect.models.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {
    private Long id;
    private String text;
    private QuestionType type;
    private List<String> options;
    private String correctAnswer;
    private Integer points;
}