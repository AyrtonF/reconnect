package com.nassau.reconnect.repositories;
import com.nassau.reconnect.models.TextMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextMaterialRepository extends JpaRepository<TextMaterial, Long> {

    List<TextMaterial> findByModuleId(Long moduleId);

    List<TextMaterial> findByIsRead(boolean isRead);
}