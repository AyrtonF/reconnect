package com.nassau.reconnect.security;

import com.nassau.reconnect.models.InstitutionCourse;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.repositories.InstitutionCourseRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("institutionCourseSecurity")
@RequiredArgsConstructor
public class InstitutionCourseSecurity {

    private final InstitutionCourseRepository institutionCourseRepository;
    private final UserRepository userRepository;

    public boolean canManageCourse(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // ADMIN pode gerenciar qualquer curso
        if (user.getRole().name().equals("ADMIN")) {
            return true;
        }

        // Para INSTITUTION_ADMIN e INSTITUTION_STAFF, verificar se o curso pertence à sua instituição
        if (user.getRole().name().equals("INSTITUTION_ADMIN") ||
            user.getRole().name().equals("INSTITUTION_STAFF")) {

            Optional<InstitutionCourse> courseOpt = institutionCourseRepository.findById(courseId);
            if (courseOpt.isPresent()) {
                InstitutionCourse course = courseOpt.get();
                return course.getInstitution().getId().equals(user.getInstitutionId());
            }
        }

        return false;
    }

    public boolean canCreateCourse() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // Verificar se o usuário tem role adequada
        return user.getRole().name().equals("ADMIN") ||
               user.getRole().name().equals("INSTITUTION_ADMIN") ||
               user.getRole().name().equals("INSTITUTION_STAFF");
    }

    public boolean canDeleteCourse(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // ADMIN pode deletar qualquer curso
        if (user.getRole().name().equals("ADMIN")) {
            return true;
        }

        // Apenas INSTITUTION_ADMIN pode deletar cursos da sua instituição
        if (user.getRole().name().equals("INSTITUTION_ADMIN")) {
            Optional<InstitutionCourse> courseOpt = institutionCourseRepository.findById(courseId);
            if (courseOpt.isPresent()) {
                InstitutionCourse course = courseOpt.get();
                return course.getInstitution().getId().equals(user.getInstitutionId());
            }
        }

        return false;
    }
}
