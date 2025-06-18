package com.nassau.reconnect.dtos.course;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDto {
    private Long id;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer score;
    private List<Answer> answers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Answer {
        private Long questionId;
        private String answer;
        private boolean isCorrect;
    }
}