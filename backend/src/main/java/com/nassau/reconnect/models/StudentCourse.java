package com.nassau.reconnect.models;

import com.nassau.reconnect.models.enums.CourseLevel;
import com.nassau.reconnect.models.enums.CourseProgressStatus;
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
@Table(name = "student_courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String instructor;

    private String thumbnail;

    private Integer workload;

    private String category;

    @Enumerated(EnumType.STRING)
    private CourseLevel level;

    private Double price;

    @ManyToMany(mappedBy = "courses")
    private Set<User> enrolledStudents = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @OrderBy("order ASC")
    private List<CourseModule> modules = new ArrayList<>();

    @Embedded
    private CourseProgress progress;

    @Embedded
    private CourseScore score;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(
            name = "student_course_tags",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "student_course_prerequisites",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "prerequisite")
    private List<String> prerequisites = new ArrayList<>();

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseProgress {
        private Integer completed;

        // Adicione a anotação para especificar um nome de coluna diferente
        @Column(name = "progress_total")
        private Integer total;

        private Integer percentageCompleted;
        private LocalDateTime lastAccessDate;

        @Enumerated(EnumType.STRING)
        private CourseProgressStatus status;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseScore {
        private Integer current;

        // Adicione a anotação para especificar um nome de coluna diferente
        @Column(name = "score_total")
        private Integer total;

        @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
        private List<Achievement> achievements = new ArrayList<>();
    }
}