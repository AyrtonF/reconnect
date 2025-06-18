package com.nassau.reconnect.dtos.coupon;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponCreateDto {
    @NotBlank(message = "Título é obrigatório")
    private String title;

    private String image;
    private String description;

    @PositiveOrZero(message = "Pontuação requerida deve ser não negativa")
    private Integer scoreRequired;

    private LocalDateTime validUntil;
}