package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.StudentVideoDto;
import com.nassau.reconnect.models.StudentVideo;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface StudentVideoMapper {

    StudentVideoDto toDto(StudentVideo video);
}