package com.nassau.reconnect.security;


import com.nassau.reconnect.models.Challenge;
import com.nassau.reconnect.models.Family;
import com.nassau.reconnect.repositories.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ChallengeSecurity {

    private final ChallengeRepository challengeRepository;

    public boolean canManageChallenge(Long challengeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            Optional<Challenge> challengeOpt = challengeRepository.findById(challengeId);
            if (challengeOpt.isPresent()) {
                Challenge challenge = challengeOpt.get();

                // If challenge is associated with a family
                if (challenge.getFamily() != null) {
                    Family family = challenge.getFamily();

                    // Check if user is a member of the family
                    return family.getMembers().stream()
                            .anyMatch(member -> member.getId().equals(userPrincipal.getId()));
                }

                // Check if user is a participant in the challenge
                return challenge.getParticipants().stream()
                        .anyMatch(participant -> participant.getId().equals(userPrincipal.getId()));
            }
        }

        return false;
    }
}