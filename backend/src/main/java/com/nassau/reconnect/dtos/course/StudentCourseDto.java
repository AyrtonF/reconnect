package com.nassau.reconnect.dtos.course;

import com.nassau.reconnect.models.enums.CourseLevel;
import com.nassau.reconnect.models.enums.CourseProgressStatus;
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
public class StudentCourseDto {
    private Long id;
    private String title;
    private String description;
    private String instructor;
    private String thumbnail;
    private Integer workload;
    private String category;
    private CourseLevel level;
    private Double price;
    private Boolean isEnrolled;
    private LocalDateTime enrollmentDate;
    private List<CourseModuleDto> modules;
    private CourseProgress progress;
    private CourseScore score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> tags;
    private List<String> prerequisites;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseProgress {
        private Integer completed;
        private Integer total;
        private Integer percentageCompleted;
        private LocalDateTime lastAccessDate;
        private CourseProgressStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseScore {
        private Integer current;
        private Integer total;
        private List<AchievementDto> achievements;
    }
}