package com.nassau.reconnect.security;

import com.nassau.reconnect.models.Family;
import com.nassau.reconnect.repositories.FamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FamilySecurity {

    private final FamilyRepository familyRepository;

    public boolean canManageFamily(Long familyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            Optional<Family> familyOpt = familyRepository.findById(familyId);
            if (familyOpt.isPresent()) {
                Family family = familyOpt.get();

                // Check if user is a member of the family
                return family.getMembers().stream()
                        .anyMatch(member -> member.getId().equals(userPrincipal.getId()));
            }
        }

        return false;
    }
}