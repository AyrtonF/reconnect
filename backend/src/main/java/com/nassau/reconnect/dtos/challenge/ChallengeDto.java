package com.nassau.reconnect.dtos.challenge;


import com.nassau.reconnect.models.enums.ChallengeStatus;
import com.nassau.reconnect.models.enums.ChallengeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeDto {
    private Long id;
    private String title;
    private String description;
    private ChallengeStatus status;
    private List<Long> participantsIds;
    private String image;
    private String imageBanner;
    private Integer checks;
    private Integer score;
    private ChallengeType type;
    private Long familyId;
}