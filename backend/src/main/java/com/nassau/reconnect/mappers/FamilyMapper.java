package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.family.FamilyCreateDto;
import com.nassau.reconnect.dtos.family.FamilyDto;
import com.nassau.reconnect.models.Family;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {})
public interface FamilyMapper {

    @Mapping(target = "membersIds", expression = "java(getMembersIds(family))")
    @Mapping(target = "postsIds", expression = "java(getPostsIds(family))")
    @Mapping(target = "challengesIds", expression = "java(getChallengesIds(family))")
    FamilyDto toDto(Family family);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "challenges", ignore = true)
    Family toEntity(FamilyCreateDto familyCreateDto);

    default List<Long> getMembersIds(Family family) {
        if (family.getMembers() == null) return null;
        return family.getMembers().stream()
                .map(user -> user.getId())
                .collect(Collectors.toList());
    }

    default List<Long> getPostsIds(Family family) {
        if (family.getPosts() == null) return null;
        return family.getPosts().stream()
                .map(post -> post.getId())
                .collect(Collectors.toList());
    }

    default List<Long> getChallengesIds(Family family) {
        if (family.getChallenges() == null) return null;
        return family.getChallenges().stream()
                .map(challenge -> challenge.getId())
                .collect(Collectors.toList());
    }
}