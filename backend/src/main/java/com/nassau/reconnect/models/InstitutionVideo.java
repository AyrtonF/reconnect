package com.nassau.reconnect.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "institution_videos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private InstitutionCourse course;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String filename;

    @Transient
    private byte[] file;

    private Integer duration;

    private String thumbnail;

    private String url;

    @CreationTimestamp
    private LocalDateTime uploadedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}