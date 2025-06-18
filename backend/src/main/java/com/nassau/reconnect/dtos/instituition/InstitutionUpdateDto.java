package com.nassau.reconnect.dtos.instituition;

import com.nassau.reconnect.models.enums.InstitutionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionUpdateDto {
    private String name;
    private String phone;
    private String address;
    private String logo;
    private String description;
    private InstitutionStatus status;
    private InstitutionDto.SocialMediaDto socialMedia;
    private InstitutionDto.SettingsDto settings;
}