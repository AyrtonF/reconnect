package com.nassau.reconnect.dtos.instituition;


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
public class InstitutionQuestionDto {
    private Long id;
    private Long courseId;
    private String question;
    private List<String> alternatives;
    private Integer correctAnswer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}