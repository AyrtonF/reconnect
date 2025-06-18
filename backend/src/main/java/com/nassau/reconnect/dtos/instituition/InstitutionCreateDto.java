package com.nassau.reconnect.dtos.instituition;


import jakarta.validation.constraints.Email;
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
public class InstitutionCreateDto {
    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    private String phone;

    private String address;
    private String logo;
    private String description;

    private InstitutionDto.SocialMediaDto socialMedia;

    @NotNull(message = "Configurações são obrigatórias")
    private InstitutionDto.SettingsDto settings;
}