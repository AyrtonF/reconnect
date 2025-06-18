package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.instituition.InstitutionCourseCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseDto;
import com.nassau.reconnect.models.InstitutionCourse;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {
        InstitutionMaterialMapper.class,
        InstitutionVideoMapper.class,
        InstitutionQuestionMapper.class
})
public interface InstitutionCourseMapper {

    @Mapping(target = "institutionId", source = "institution.id")
    @Mapping(target = "studentsEnrolled", expression = "java(getStudentsEnrolledIds(course))")
    InstitutionCourseDto toDto(InstitutionCourse course);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "institution", ignore = true)
    @Mapping(target = "materials", ignore = true)
    @Mapping(target = "videos", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "studentsEnrolled", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    InstitutionCourse toEntity(InstitutionCourseCreateDto courseCreateDto);

    default List<Long> getStudentsEnrolledIds(InstitutionCourse course) {
        if (course.getStudentsEnrolled() == null) return null;
        return course.getStudentsEnrolled().stream()
                .map(student -> student.getId())
                .collect(Collectors.toList());
    }
}