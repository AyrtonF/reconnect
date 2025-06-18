package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.InstitutionQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionQuestionRepository extends JpaRepository<InstitutionQuestion, Long> {

    List<InstitutionQuestion> findByCourseId(Long courseId);
}