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
public class CourseModuleDto {
    private Long id;
    private String title;
    private String description;
    private Integer order;
    private ModuleContent content;
    private boolean isLocked;
    private Integer progress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleContent {
        private List<StudentVideoDto> videos;
        private List<TextMaterialDto> textMaterials;
        private List<QuizDto> quizzes;
    }
}