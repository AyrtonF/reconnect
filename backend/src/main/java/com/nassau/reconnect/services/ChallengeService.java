package com.nassau.reconnect.services;

import com.nassau.reconnect.dtos.challenge.ChallengeCreateDto;
import com.nassau.reconnect.dtos.challenge.ChallengeDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.ChallengeMapper;
import com.nassau.reconnect.models.Challenge;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.models.enums.ChallengeStatus;
import com.nassau.reconnect.models.enums.ChallengeType;
import com.nassau.reconnect.repositories.ChallengeRepository;
import com.nassau.reconnect.repositories.FamilyRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeMapper challengeMapper;
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    public List<ChallengeDto> getAllChallenges() {
        return challengeRepository.findAll().stream()
                .map(challengeMapper::toDto)
                .collect(Collectors.toList());
    }

    public ChallengeDto getChallengeById(Long id) {
        return challengeRepository.findById(id)
                .map(challengeMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));
    }

    public List<ChallengeDto> getChallengesByFamily(Long familyId) {
        return challengeRepository.findByFamilyId(familyId).stream()
                .map(challengeMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ChallengeDto> getChallengesByStatus(ChallengeStatus status) {
        return challengeRepository.findByStatus(status).stream()
                .map(challengeMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ChallengeDto> getChallengesByType(ChallengeType type) {
        return challengeRepository.findByType(type).stream()
                .map(challengeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChallengeDto createChallenge(ChallengeCreateDto challengeCreateDto) {
        Challenge challenge = challengeMapper.toEntity(challengeCreateDto);

        // Set family if provided
        if (challengeCreateDto.getFamilyId() != null) {
            challenge.setFamily(familyRepository.findById(challengeCreateDto.getFamilyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + challengeCreateDto.getFamilyId())));
        }

        Challenge savedChallenge = challengeRepository.save(challenge);
        return challengeMapper.toDto(savedChallenge);
    }

    @Transactional
    public ChallengeDto updateChallenge(Long id, ChallengeDto challengeUpdateDto) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));

        // Update basic fields
        challenge.setTitle(challengeUpdateDto.getTitle());
        challenge.setDescription(challengeUpdateDto.getDescription());
        challenge.setStatus(challengeUpdateDto.getStatus());
        challenge.setImage(challengeUpdateDto.getImage());
        challenge.setImageBanner(challengeUpdateDto.getImageBanner());
        challenge.setScore(challengeUpdateDto.getScore());
        challenge.setType(challengeUpdateDto.getType());

        // Update family if provided
        if (challengeUpdateDto.getFamilyId() != null) {
            challenge.setFamily(familyRepository.findById(challengeUpdateDto.getFamilyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Family not found with id: " + challengeUpdateDto.getFamilyId())));
        } else {
            challenge.setFamily(null);
        }

        Challenge updatedChallenge = challengeRepository.save(challenge);
        return challengeMapper.toDto(updatedChallenge);
    }

    @Transactional
    public void deleteChallenge(Long id) {
        if (!challengeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Challenge not found with id: " + id);
        }

        challengeRepository.deleteById(id);
    }

    @Transactional
    public boolean participateInChallenge(Long challengeId, Long userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is already participating
        if (user.getPendingChallenges().contains(challenge) || user.getCompletedChallenges().contains(challenge)) {
            return false;
        }

        // Add user to participants and challenge to user's pending challenges
        user.getPendingChallenges().add(challenge);
        userRepository.save(user);

        return true;
    }

    @Transactional
    public boolean completeChallenge(Long challengeId, Long userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is participating in the challenge
        if (!user.getPendingChallenges().contains(challenge)) {
            return false;
        }

        // Move challenge from pending to completed and award points
        user.getPendingChallenges().remove(challenge);
        user.getCompletedChallenges().add(challenge);

        // Award points if challenge has score
        if (challenge.getScore() != null) {
            if (user.getScore() == null) {
                user.setScore(challenge.getScore());
            } else {
                user.setScore(user.getScore() + challenge.getScore());
            }
        }

        // Update challenge check count
        if (challenge.getChecks() == null) {
            challenge.setChecks(1);
        } else {
            challenge.setChecks(challenge.getChecks() + 1);
        }

        challengeRepository.save(challenge);
        userRepository.save(user);

        return true;
    }
}