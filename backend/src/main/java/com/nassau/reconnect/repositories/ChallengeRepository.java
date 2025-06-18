package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.Challenge;
import com.nassau.reconnect.models.enums.ChallengeStatus;
import com.nassau.reconnect.models.enums.ChallengeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    List<Challenge> findByFamilyId(Long familyId);

    List<Challenge> findByStatus(ChallengeStatus status);

    List<Challenge> findByType(ChallengeType type);

    List<Challenge> findByScoreGreaterThanEqual(Integer scoreThreshold);
}