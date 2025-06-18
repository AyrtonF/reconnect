package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.Institution;
import com.nassau.reconnect.models.enums.InstitutionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {

    Optional<Institution> findByEmail(String email);

    List<Institution> findByStatus(InstitutionStatus status);

    boolean existsByEmail(String email);
}