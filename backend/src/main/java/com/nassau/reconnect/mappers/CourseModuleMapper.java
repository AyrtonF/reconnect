package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.CourseModuleDto;
import com.nassau.reconnect.models.CourseModule;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {
        StudentVideoMapper.class,
        TextMaterialMapper.class,
        QuizMapper.class
})
public interface CourseModuleMapper {

    @Mapping(target = "content.videos", source = "content.videos")
    @Mapping(target = "content.textMaterials", source = "content.textMaterials")
    @Mapping(target = "content.quizzes", source = "content.quizzes")
    CourseModuleDto toDto(CourseModule module);

    CourseModuleDto.ModuleContent toModuleContentDto(CourseModule.ModuleContent content);
}