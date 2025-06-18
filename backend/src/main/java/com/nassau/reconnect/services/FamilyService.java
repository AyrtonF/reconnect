package com.nassau.reconnect.services;

import com.nassau.reconnect.dtos.family.FamilyCreateDto;
import com.nassau.reconnect.dtos.family.FamilyDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.FamilyMapper;
import com.nassau.reconnect.models.Family;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.repositories.FamilyRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final FamilyMapper familyMapper;

    public List<FamilyDto> getAllFamilies() {
        return familyRepository.findAll().stream()
                .map(familyMapper::toDto)
                .collect(Collectors.toList());
    }

    public FamilyDto getFamilyById(Long id) {
        return familyRepository.findById(id)
                .map(familyMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + id));
    }

    public List<FamilyDto> searchFamiliesByName(String name) {
        return familyRepository.findByNameContainingIgnoreCase(name).stream()
                .map(familyMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<FamilyDto> getUserFamilies(Long userId) {
        return familyRepository.findFamiliesByUserId(userId).stream()
                .map(familyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FamilyDto createFamily(FamilyCreateDto familyCreateDto) {
        Family family = familyMapper.toEntity(familyCreateDto);

        // Add initial members
        if (familyCreateDto.getInitialMembersIds() != null && !familyCreateDto.getInitialMembersIds().isEmpty()) {
            for (Long memberId : familyCreateDto.getInitialMembersIds()) {
                User user = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberId));
                user.getFamilies().add(family);
                userRepository.save(user);
            }
        }

        Family savedFamily = familyRepository.save(family);
        return familyMapper.toDto(savedFamily);
    }

    @Transactional
    public FamilyDto updateFamily(Long id, FamilyDto familyUpdateDto) {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + id));

        family.setName(familyUpdateDto.getName());
        Family updatedFamily = familyRepository.save(family);

        return familyMapper.toDto(updatedFamily);
    }

    @Transactional
    public void deleteFamily(Long id) {
        Family family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + id));

        // Remove family from all members' families
        for (User user : family.getMembers()) {
            user.getFamilies().remove(family);
            userRepository.save(user);
        }

        familyRepository.deleteById(id);
    }

    @Transactional
    public boolean addMemberToFamily(Long familyId, Long userId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + familyId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is already a member
        if (user.getFamilies().contains(family)) {
            return false;
        }

        // Add user to family
        user.getFamilies().add(family);
        userRepository.save(user);

        return true;
    }

    @Transactional
    public boolean removeMemberFromFamily(Long familyId, Long userId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + familyId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is a member
        if (!user.getFamilies().contains(family)) {
            return false;
        }

        // Remove user from family
        user.getFamilies().remove(family);
        userRepository.save(user);

        return true;
    }
}