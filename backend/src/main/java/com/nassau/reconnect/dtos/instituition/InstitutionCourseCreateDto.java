package com.nassau.reconnect.dtos.instituition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<InstitutionMaterialDto> materials;
    private List<InstitutionVideoDto> videos;
    private List<InstitutionQuestionDto> questions;

    private InstitutionCourseDto.Settings settings;
}
