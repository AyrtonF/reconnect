package com.nassau.reconnect.models;




import com.nassau.reconnect.models.enums.Role;
import com.nassau.reconnect.models.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "institution_users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Long institutionId;

    private String avatar;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Embedded
    private UserPermissions permissions;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserPermissions {
        private boolean canCreateCourses;
        private boolean canEditCourses;
        private boolean canDeleteCourses;
        private boolean canManageUsers;
        private boolean canViewReports;
    }
}