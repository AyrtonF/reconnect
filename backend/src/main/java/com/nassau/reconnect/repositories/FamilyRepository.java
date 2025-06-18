package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

    List<Family> findByNameContainingIgnoreCase(String name);

    @Query("SELECT f FROM Family f JOIN f.members m WHERE m.id = :userId")
    List<Family> findFamiliesByUserId(@Param("userId") Long userId);
}