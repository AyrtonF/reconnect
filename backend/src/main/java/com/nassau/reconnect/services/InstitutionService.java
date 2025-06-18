package com.nassau.reconnect.services;



import com.nassau.reconnect.dtos.instituition.InstitutionCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionDto;
import com.nassau.reconnect.dtos.instituition.InstitutionUpdateDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.InstitutionMapper;
import com.nassau.reconnect.models.Institution;
import com.nassau.reconnect.models.enums.InstitutionStatus;
import com.nassau.reconnect.repositories.InstitutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final InstitutionMapper institutionMapper;

    public List<InstitutionDto> getAllInstitutions() {
        return institutionRepository.findAll().stream()
                .map(institutionMapper::toDto)
                .collect(Collectors.toList());
    }

    public InstitutionDto getInstitutionById(Long id) {
        return institutionRepository.findById(id)
                .map(institutionMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found with id: " + id));
    }

    public List<InstitutionDto> getInstitutionsByStatus(InstitutionStatus status) {
        return institutionRepository.findByStatus(status).stream()
                .map(institutionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstitutionDto createInstitution(InstitutionCreateDto institutionCreateDto) {
        if (institutionRepository.existsByEmail(institutionCreateDto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Institution institution = institutionMapper.toEntity(institutionCreateDto);
        institution.setStatus(InstitutionStatus.PENDING);
        Institution savedInstitution = institutionRepository.save(institution);

        return institutionMapper.toDto(savedInstitution);
    }

    @Transactional
    public InstitutionDto updateInstitution(Long id, InstitutionUpdateDto institutionUpdateDto) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found with id: " + id));

        institutionMapper.updateEntityFromDto(institutionUpdateDto, institution);
        Institution updatedInstitution = institutionRepository.save(institution);

        return institutionMapper.toDto(updatedInstitution);
    }

    @Transactional
    public void deleteInstitution(Long id) {
        if (!institutionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Institution not found with id: " + id);
        }

        institutionRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return institutionRepository.existsByEmail(email);
    }
}