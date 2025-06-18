package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.InstitutionCourse;
import com.nassau.reconnect.models.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionCourseRepository extends JpaRepository<InstitutionCourse, Long> {

    List<InstitutionCourse> findByInstitutionId(Long institutionId);

    List<InstitutionCourse> findByInstitutionIdAndStatus(Long institutionId, CourseStatus status);

    List<InstitutionCourse> findByNameContainingIgnoreCase(String name);
}