package com.nassau.reconnect.models;




import com.nassau.reconnect.models.enums.InstitutionStatus;
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
@Table(name = "institutions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String address;

    private String logo;

    @Column(length = 2000)
    private String description;

    @OneToMany(mappedBy = "institution")
    private List<InstitutionCourse> courses = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "institution_students",
            joinColumns = @JoinColumn(name = "institution_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstitutionStatus status;

    @Embedded
    private SocialMedia socialMedia;

    @Embedded
    private Settings settings;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialMedia {
        private String website;
        private String facebook;
        private String instagram;
        private String linkedin;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Settings {
        private boolean allowEnrollment;
        private boolean requireApproval;
        private Integer maxStudentsPerCourse;
    }
}