package com.nassau.reconnect.dtos.challenge;


import com.nassau.reconnect.models.enums.ChallengeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeCreateDto {
    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String description;

    private String image;
    private String imageBanner;

    @PositiveOrZero(message = "Pontuação deve ser não negativa")
    private Integer score;

    @NotNull(message = "Tipo de desafio é obrigatório")
    private ChallengeType type;

    private Long familyId;
}