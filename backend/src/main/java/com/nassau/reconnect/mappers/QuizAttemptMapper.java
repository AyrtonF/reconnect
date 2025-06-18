package com.nassau.reconnect.mappers;

import com.nassau.reconnect.dtos.course.QuizAttemptDto;
import com.nassau.reconnect.models.QuizAttempt;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {})
public interface QuizAttemptMapper {

    @Mapping(target = "answers", source = "answers")
    QuizAttemptDto toDto(QuizAttempt attempt);

    QuizAttemptDto.Answer toAnswerDto(QuizAttempt.Answer answer);
}