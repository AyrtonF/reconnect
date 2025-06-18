package com.nassau.reconnect.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class InstitutionSecurity {

    public boolean hasInstitutionAccess(Long institutionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Check if user is from the institution
            return userPrincipal.getInstitutionId() != null &&
                    userPrincipal.getInstitutionId().equals(institutionId);
        }

        return false;
    }
}