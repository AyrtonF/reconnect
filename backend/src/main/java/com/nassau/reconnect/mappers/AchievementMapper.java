package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.course.AchievementDto;
import com.nassau.reconnect.models.Achievement;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface AchievementMapper {

    AchievementDto toDto(Achievement achievement);
}