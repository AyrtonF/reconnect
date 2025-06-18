package com.nassau.reconnect.repositories;
import com.nassau.reconnect.models.Achievement;
import com.nassau.reconnect.models.enums.AchievementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByCourseId(Long courseId);

    List<Achievement> findByType(AchievementType type);

    List<Achievement> findByEarnedAtIsNotNull();
}