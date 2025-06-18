package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.challenge.ChallengeCreateDto;
import com.nassau.reconnect.dtos.challenge.ChallengeDto;
import com.nassau.reconnect.models.Challenge;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {})
public interface ChallengeMapper {

    @Mapping(target = "participantsIds", expression = "java(getParticipantsIds(challenge))")
    @Mapping(target = "familyId", source = "family.id")
    ChallengeDto toDto(Challenge challenge);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "family", ignore = true)
    @Mapping(target = "checks", constant = "0")
    @Mapping(target = "status", constant = "NOT_STARTED")
    Challenge toEntity(ChallengeCreateDto challengeCreateDto);

    default List<Long> getParticipantsIds(Challenge challenge) {
        if (challenge.getParticipants() == null) return null;
        return challenge.getParticipants().stream()
                .map(user -> user.getId())
                .collect(Collectors.toList());
    }
}