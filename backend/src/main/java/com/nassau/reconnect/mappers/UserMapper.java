package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.user.UserCreateDto;
import com.nassau.reconnect.dtos.user.UserDto;
import com.nassau.reconnect.dtos.user.UserUpdateDto;
import com.nassau.reconnect.models.User;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {

    @Mapping(target = "coursesIds", expression = "java(getCoursesIds(user))")
    @Mapping(target = "familyIds", expression = "java(getFamilyIds(user))")
    @Mapping(target = "challengesCompletedIds", expression = "java(getChallengesCompletedIds(user))")
    @Mapping(target = "pendingChallengesIds", expression = "java(getPendingChallengesIds(user))")
    @Mapping(target = "couponsIds", expression = "java(getCouponsIds(user))")
    @Mapping(target = "posts", expression = "java(getPostIds(user))")
    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "families", ignore = true)
    @Mapping(target = "completedChallenges", ignore = true)
    @Mapping(target = "pendingChallenges", ignore = true)
    @Mapping(target = "imagesOfChallenge", ignore = true)
    @Mapping(target = "coupons", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "score", constant = "0")
    User toEntity(UserCreateDto userCreateDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "institutionId", ignore = true)
    @Mapping(target = "score", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "families", ignore = true)
    @Mapping(target = "completedChallenges", ignore = true)
    @Mapping(target = "pendingChallenges", ignore = true)
    @Mapping(target = "imagesOfChallenge", ignore = true)
    @Mapping(target = "coupons", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateEntityFromDto(UserUpdateDto dto, @MappingTarget User entity);

    // Helper methods for ID extraction
    default List<Long> getCoursesIds(User user) {
        if (user.getCourses() == null) return null;
        return user.getCourses().stream().map(course -> course.getId()).collect(Collectors.toList());
    }

    default List<Long> getFamilyIds(User user) {
        if (user.getFamilies() == null) return null;
        return user.getFamilies().stream().map(family -> family.getId()).collect(Collectors.toList());
    }

    default List<Long> getChallengesCompletedIds(User user) {
        if (user.getCompletedChallenges() == null) return null;
        return user.getCompletedChallenges().stream().map(challenge -> challenge.getId()).collect(Collectors.toList());
    }

    default List<Long> getPendingChallengesIds(User user) {
        if (user.getPendingChallenges() == null) return null;
        return user.getPendingChallenges().stream().map(challenge -> challenge.getId()).collect(Collectors.toList());
    }

    default List<Long> getCouponsIds(User user) {
        if (user.getCoupons() == null) return null;
        return user.getCoupons().stream().map(coupon -> coupon.getId()).collect(Collectors.toList());
    }

    default List<Long> getPostIds(User user) {
        if (user.getPosts() == null) return null;
        return user.getPosts().stream().map(post -> post.getId()).collect(Collectors.toList());
    }
}