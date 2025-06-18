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
public class InstitutionMaterialDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String filename;
    private String type;
    private Long size;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}