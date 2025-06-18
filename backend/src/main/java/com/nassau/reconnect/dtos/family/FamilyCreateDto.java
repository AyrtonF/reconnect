package com.nassau.reconnect.dtos.family;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyCreateDto {
    @NotBlank(message = "Nome é obrigatório")
    private String name;

    private List<Long> initialMembersIds;
}