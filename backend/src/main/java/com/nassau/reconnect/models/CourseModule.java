package com.nassau.reconnect.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "course_modules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private StudentCourse course;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private Integer order;

    @Embedded
    private ModuleContent content;

    private boolean isLocked;

    private Integer progress;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleContent {
        @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
        private List<StudentVideo> videos = new ArrayList<>();

        @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
        private List<TextMaterial> textMaterials = new ArrayList<>();

        @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
        private List<Quiz> quizzes = new ArrayList<>();
    }
}