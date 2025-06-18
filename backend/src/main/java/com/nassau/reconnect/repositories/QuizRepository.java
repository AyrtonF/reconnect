package com.nassau.reconnect.repositories;
import com.nassau.reconnect.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByModuleId(Long moduleId);

    List<Quiz> findByIsCompleted(boolean isCompleted);
}