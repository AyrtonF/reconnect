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

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<InstitutionMaterial> materials = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<InstitutionVideo> videos = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<InstitutionQuestion> questions = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status;

    @ManyToMany
    @JoinTable(
            name = "institution_course_enrollments",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
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
}