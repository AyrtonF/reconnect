package com.nassau.reconnect.dtos.user;


import com.nassau.reconnect.models.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Long institutionId;
    private String phone;
    private Integer score;
    private String avatar;
    private List<Long> coursesIds;
    private List<Long> familyIds;
    private List<Long> challengesCompletedIds;
    private List<Long> pendingChallengesIds;
    private List<String> imagesOfChallenge;
    private List<Long> couponsIds;
    private List<Long> posts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}