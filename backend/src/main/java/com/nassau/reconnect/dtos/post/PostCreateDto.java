package com.nassau.reconnect.dtos.post;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateDto {
    @NotNull(message = "ID do usuário é obrigatório")
    private Long userId;

    private Long familyId;
    private String caption;
    private String image;
}