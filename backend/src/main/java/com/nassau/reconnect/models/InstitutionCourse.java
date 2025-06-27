package com.nassau.reconnect.models;

import com.nassau.reconnect.models.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "institution_courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String image;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InstitutionMaterial> materials = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InstitutionVideo> videos = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InstitutionQuestion> questions = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status;

    @ManyToMany
    @JoinTable(name = "institution_course_enrollments", joinColumns = @JoinColumn(name = "course_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
    private Set<User> studentsEnrolled = new HashSet<>();

    @Embedded
    private CourseSettings settings;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseSettings {
        private boolean allowEnrollment;
        private boolean requireApproval;
        private Integer maxStudents;
    }

    // Helper methods for maintaining bidirectional relationships
    public void addMaterial(InstitutionMaterial material) {
        materials.add(material);
        material.setCourse(this);
    }

    public void removeMaterial(InstitutionMaterial material) {
        materials.remove(material);
        material.setCourse(null);
    }

    public void addVideo(InstitutionVideo video) {
        videos.add(video);
        video.setCourse(this);
    }

    public void removeVideo(InstitutionVideo video) {
        videos.remove(video);
        video.setCourse(null);
    }

    public void addQuestion(InstitutionQuestion question) {
        questions.add(question);
        question.setCourse(this);
    }

    public void removeQuestion(InstitutionQuestion question) {
        questions.remove(question);
        question.setCourse(null);
    }
}