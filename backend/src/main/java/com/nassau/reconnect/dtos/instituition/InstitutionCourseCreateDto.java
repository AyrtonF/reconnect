package com.nassau.reconnect.dtos.instituition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionCourseCreateDto {
    @NotNull(message = "ID da instituição é obrigatório")
    private Long institutionId;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    private String description;
    private String image;

    private InstitutionCourseDto.Settings settings;
}
