package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.StudentCourse;
import com.nassau.reconnect.models.enums.CourseLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseRepository extends JpaRepository<StudentCourse, Long> {

    List<StudentCourse> findByCategory(String category);

    List<StudentCourse> findByLevel(CourseLevel level);

    @Query("SELECT c FROM StudentCourse c WHERE :tagName MEMBER OF c.tags")
    List<StudentCourse> findByTag(@Param("tagName") String tagName);

    List<StudentCourse> findByInstructorContainingIgnoreCase(String instructor);

    List<StudentCourse> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}