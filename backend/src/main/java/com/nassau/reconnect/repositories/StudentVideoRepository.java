package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.StudentVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentVideoRepository extends JpaRepository<StudentVideo, Long> {

    List<StudentVideo> findByModuleId(Long moduleId);

    List<StudentVideo> findByIsWatched(boolean isWatched);
}