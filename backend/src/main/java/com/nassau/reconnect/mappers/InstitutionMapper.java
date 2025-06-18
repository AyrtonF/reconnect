package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.instituition.InstitutionCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionDto;
import com.nassau.reconnect.dtos.instituition.InstitutionUpdateDto;
import com.nassau.reconnect.models.Institution;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {})
public interface InstitutionMapper {

    @Mapping(target = "coursesIds", expression = "java(getCoursesIds(institution))")
    @Mapping(target = "studentsIds", expression = "java(getStudentsIds(institution))")
    @Mapping(target = "socialMedia", source = "socialMedia")
    @Mapping(target = "settings", source = "settings")
    InstitutionDto toDto(Institution institution);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    Institution toEntity(InstitutionCreateDto institutionCreateDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "courses", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(InstitutionUpdateDto dto, @MappingTarget Institution entity);

    default List<Long> getCoursesIds(Institution institution) {
        if (institution.getCourses() == null) return null;
        return institution.getCourses().stream()
                .map(course -> course.getId())
                .collect(Collectors.toList());
    }

    default List<Long> getStudentsIds(Institution institution) {
        if (institution.getStudents() == null) return null;
        return institution.getStudents().stream()
                .map(student -> student.getId())
                .collect(Collectors.toList());
    }
}
