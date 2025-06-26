package com.nassau.reconnect.controllers;


import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.instituition.InstitutionCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionDto;
import com.nassau.reconnect.dtos.instituition.InstitutionUpdateDto;
import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.models.Institution;
import com.nassau.reconnect.models.enums.InstitutionStatus;
import com.nassau.reconnect.models.enums.Role;
import com.nassau.reconnect.repositories.InstitutionRepository;
import com.nassau.reconnect.services.InstitutionService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/institutions")
@RequiredArgsConstructor
@CrossOrigin
public class InstitutionController {

    private final InstitutionService institutionService;
    private final InstitutionRepository institutionRepository;

    @PostConstruct
    public void init() {
        // Criar a instituição "Secretaria de Educação" com ID 1 se não existir
        if (!institutionRepository.existsById(1L)) {
            System.out.println("Creating default institution: Secretaria de Educação");

            Institution secretariaEducacao = new Institution();
            secretariaEducacao.setId(1L);
            secretariaEducacao.setName("Secretaria de Educação");
            secretariaEducacao.setEmail("contato@secretariaeducacao.gov.br");
            secretariaEducacao.setPhone("(81) 3183-8000");
            secretariaEducacao.setDescription("Secretaria de Educação responsável pela gestão educacional");
            secretariaEducacao.setStatus(InstitutionStatus.ACTIVE);

            Institution.Settings settings = new Institution.Settings();
            settings.setAllowEnrollment(true);
            settings.setRequireApproval(false);
            settings.setMaxStudentsPerCourse(100);
            secretariaEducacao.setSettings(settings);

            Institution.SocialMedia socialMedia = new Institution.SocialMedia();
            socialMedia.setWebsite("https://secretariaeducacao.gov.br");
            socialMedia.setFacebook("secretariaeducacao");
            socialMedia.setInstagram("secretaria_educacao");
            secretariaEducacao.setSocialMedia(socialMedia);

            institutionRepository.save(secretariaEducacao);
            System.out.println("Successfully created Secretaria de Educação with ID: 1");
        } else {
            System.out.println("Secretaria de Educação already exists with ID: 1");
        }
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<InstitutionDto>>> getAllInstitutions() {
        List<InstitutionDto> institutions = institutionService.getAllInstitutions();
        return ResponseEntity.ok(ApiResponse.success(institutions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstitutionDto>> getInstitutionById(@PathVariable Long id) {
        InstitutionDto institution = institutionService.getInstitutionById(id);
        return ResponseEntity.ok(ApiResponse.success(institution));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<InstitutionDto>>> getInstitutionsByStatus(@PathVariable InstitutionStatus status) {
        List<InstitutionDto> institutions = institutionService.getInstitutionsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(institutions));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InstitutionDto>> createInstitution(@Valid @RequestBody InstitutionCreateDto institutionCreateDto) {
        InstitutionDto createdInstitution = institutionService.createInstitution(institutionCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdInstitution, "Institution created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTITUTION_ADMIN') and @institutionSecurity.hasInstitutionAccess(#id))")
    public ResponseEntity<ApiResponse<InstitutionDto>> updateInstitution(
            @PathVariable Long id,
            @Valid @RequestBody InstitutionUpdateDto institutionUpdateDto) {
        InstitutionDto updatedInstitution = institutionService.updateInstitution(id, institutionUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedInstitution, "Institution updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteInstitution(@PathVariable Long id) {
        institutionService.deleteInstitution(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Institution deleted successfully"));
    }
}