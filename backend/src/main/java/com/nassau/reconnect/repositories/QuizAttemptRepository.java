package com.nassau.reconnect.repositories;
import com.nassau.reconnect.models.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByQuizId(Long quizId);

    List<QuizAttempt> findByQuizIdOrderByScoreDesc(Long quizId);
}