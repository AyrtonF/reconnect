package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByInstitutionId(Long institutionId);

    boolean existsByEmail(String email);
}