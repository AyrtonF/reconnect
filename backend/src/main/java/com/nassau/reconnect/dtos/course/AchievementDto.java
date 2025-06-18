package com.nassau.reconnect.dtos.course;

import com.nassau.reconnect.models.enums.AchievementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementDto {
    private Long id;
    private String title;
    private String description;
    private Integer points;
    private LocalDateTime earnedAt;
    private AchievementType type;
    private String icon;
}