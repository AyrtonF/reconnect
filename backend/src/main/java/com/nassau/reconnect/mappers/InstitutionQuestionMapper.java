package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.instituition.InstitutionQuestionDto;
import com.nassau.reconnect.models.InstitutionQuestion;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface InstitutionQuestionMapper {

    @Mapping(target = "courseId", source = "course.id")
    InstitutionQuestionDto toDto(InstitutionQuestion question);
}