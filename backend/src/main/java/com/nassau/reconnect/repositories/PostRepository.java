package com.nassau.reconnect.repositories;


import com.nassau.reconnect.models.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByFamilyId(Long familyId);

    List<Post> findByUserId(Long userId);

    Page<Post> findByFamilyId(Long familyId, Pageable pageable);

    Page<Post> findByUserId(Long userId, Pageable pageable);
}