package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.instituition.InstitutionVideoDto;
import com.nassau.reconnect.models.InstitutionVideo;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface InstitutionVideoMapper {

    @Mapping(target = "courseId", source = "course.id")
    InstitutionVideoDto toDto(InstitutionVideo video);
}