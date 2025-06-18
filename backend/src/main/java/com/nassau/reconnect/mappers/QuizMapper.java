package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.QuizDto;
import com.nassau.reconnect.models.Quiz;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {
        QuizQuestionMapper.class,
        QuizAttemptMapper.class
})
public interface QuizMapper {

    @Mapping(target = "questions", source = "questions")
    @Mapping(target = "attempts", source = "attempts")
    QuizDto toDto(Quiz quiz);
}