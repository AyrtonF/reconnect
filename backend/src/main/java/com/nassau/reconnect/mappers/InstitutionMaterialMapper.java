package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.instituition.InstitutionMaterialDto;
import com.nassau.reconnect.models.InstitutionMaterial;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface InstitutionMaterialMapper {

    @Mapping(target = "courseId", source = "course.id")
    InstitutionMaterialDto toDto(InstitutionMaterial material);
}