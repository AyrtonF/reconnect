package com.nassau.reconnect.dtos.instituition;

import com.nassau.reconnect.models.enums.InstitutionStatus;
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
public class InstitutionDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String logo;
    private String description;
    private List<Long> coursesIds;
    private List<Long> studentsIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private InstitutionStatus status;
    private SocialMediaDto socialMedia;
    private SettingsDto settings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialMediaDto {
        private String website;
        private String facebook;
        private String instagram;
        private String linkedin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SettingsDto {
        private boolean allowEnrollment;
        private boolean requireApproval;
        private Integer maxStudentsPerCourse;
    }
}