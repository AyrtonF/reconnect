package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.StudentCourseDto;
import com.nassau.reconnect.models.StudentCourse;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {
        CourseModuleMapper.class,
        AchievementMapper.class
})
public interface StudentCourseMapper {

    @Mapping(target = "modules", source = "modules")
    @Mapping(target = "progress", source = "progress")
    @Mapping(target = "score", source = "score")
    StudentCourseDto toDto(StudentCourse course);

    @Mapping(target = "achievements", ignore = true)
    StudentCourseDto.CourseScore toScoreDto(StudentCourse.CourseScore score);
}