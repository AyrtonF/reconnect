package com.nassau.reconnect.controllers;


import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.instituition.InstitutionCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionDto;
import com.nassau.reconnect.dtos.instituition.InstitutionUpdateDto;
import com.nassau.reconnect.models.enums.InstitutionStatus;
import com.nassau.reconnect.services.InstitutionService;
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