package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.InstitutionUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionUserRepository extends JpaRepository<InstitutionUser, Long> {

    Optional<InstitutionUser> findByEmail(String email);

    List<InstitutionUser> findByInstitutionId(Long institutionId);

    boolean existsByEmail(String email);
}