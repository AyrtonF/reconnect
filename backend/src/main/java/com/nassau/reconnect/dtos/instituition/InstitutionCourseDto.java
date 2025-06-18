package com.nassau.reconnect.dtos.instituition;


import com.nassau.reconnect.models.enums.CourseStatus;
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
public class InstitutionCourseDto {
    private Long id;
    private Long institutionId;
    private String name;
    private String description;
    private String image;
    private List<InstitutionMaterialDto> materials;
    private List<InstitutionVideoDto> videos;
    private List<InstitutionQuestionDto> questions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CourseStatus status;
    private List<Long> studentsEnrolled;
    private Settings settings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Settings {
        private boolean allowEnrollment;
        private boolean requireApproval;
        private Integer maxStudents;
    }
}