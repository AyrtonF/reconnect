package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.course.StudentCourseDto;
import com.nassau.reconnect.models.enums.CourseLevel; // Adicionar esta importação
import com.nassau.reconnect.services.StudentCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@CrossOrigin
public class StudentCourseController {

    private final StudentCourseService studentCourseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentCourseDto>>> getAllCourses() {
        List<StudentCourseDto> courses = studentCourseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentCourseDto>> getCourseById(@PathVariable Long id) {
        StudentCourseDto course = studentCourseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<StudentCourseDto>>> getCoursesByCategory(@PathVariable String category) {
        List<StudentCourseDto> courses = studentCourseService.getCoursesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<ApiResponse<List<StudentCourseDto>>> getCoursesByLevel(@PathVariable CourseLevel level) {
        List<StudentCourseDto> courses = studentCourseService.getCoursesByLevel(level);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<ApiResponse<List<StudentCourseDto>>> getCoursesByTag(@PathVariable String tag) {
        List<StudentCourseDto> courses = studentCourseService.getCoursesByTag(tag);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StudentCourseDto>>> searchCourses(@RequestParam String query) {
        List<StudentCourseDto> courses = studentCourseService.searchCourses(query);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> enrollInCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId) {
        boolean enrolled = studentCourseService.enrollInCourse(courseId, userId);
        if (enrolled) {
            return ResponseEntity.ok(ApiResponse.success(true, "Successfully enrolled in course"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to enroll in course", "You may already be enrolled"));
        }
    }

    @PutMapping("/{courseId}/progress/video/{videoId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<StudentCourseDto>> markVideoAsWatched(
            @PathVariable Long courseId,
            @PathVariable Long videoId,
            @PathVariable Long userId,
            @RequestParam(required = false) Long moduleId) {
        StudentCourseDto updatedCourse = studentCourseService.updateVideoProgress(courseId, moduleId, videoId, userId);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Video progress updated successfully"));
    }

    @PutMapping("/{courseId}/progress/material/{materialId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<StudentCourseDto>> markMaterialAsRead(
            @PathVariable Long courseId,
            @PathVariable Long materialId,
            @PathVariable Long userId,
            @RequestParam(required = false) Long moduleId) {
        StudentCourseDto updatedCourse = studentCourseService.updateMaterialProgress(courseId, moduleId, materialId, userId);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Material progress updated successfully"));
    }

    @PutMapping("/{courseId}/progress/quiz/{quizId}/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<StudentCourseDto>> completeQuiz(
            @PathVariable Long courseId,
            @PathVariable Long quizId,
            @PathVariable Long userId,
            @RequestParam(required = false) Long moduleId,
            @RequestParam Integer score) {
        StudentCourseDto updatedCourse = studentCourseService.updateQuizProgress(courseId, moduleId, quizId, userId, score);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Quiz progress updated successfully"));
    }
}