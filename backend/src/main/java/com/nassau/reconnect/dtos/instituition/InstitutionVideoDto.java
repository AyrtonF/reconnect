package com.nassau.reconnect.dtos.instituition;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionVideoDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String filename;
    private Integer duration;
    private String thumbnail;
    private String url;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}