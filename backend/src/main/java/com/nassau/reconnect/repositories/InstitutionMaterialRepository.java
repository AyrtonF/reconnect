package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.InstitutionMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionMaterialRepository extends JpaRepository<InstitutionMaterial, Long> {

    List<InstitutionMaterial> findByCourseId(Long courseId);
}
