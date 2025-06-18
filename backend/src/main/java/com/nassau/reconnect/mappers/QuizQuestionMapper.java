package com.nassau.reconnect.mappers;


import com.nassau.reconnect.dtos.course.QuizQuestionDto;
import com.nassau.reconnect.models.QuizQuestion;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface QuizQuestionMapper {

    QuizQuestionDto toDto(QuizQuestion question);
}