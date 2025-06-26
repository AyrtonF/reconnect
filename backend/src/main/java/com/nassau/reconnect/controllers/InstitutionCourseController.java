package com.nassau.reconnect.controllers;


import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseDto;
import com.nassau.reconnect.models.enums.CourseStatus;
import com.nassau.reconnect.services.InstitutionCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/institution-courses")
@RequiredArgsConstructor
@CrossOrigin
public class InstitutionCourseController {

    private final InstitutionCourseService institutionCourseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> getAllCourses() {
        List<InstitutionCourseDto> courses = institutionCourseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> getCourseById(@PathVariable Long id) {
        InstitutionCourseDto course = institutionCourseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> getCoursesByInstitution(@PathVariable Long institutionId) {
        List<InstitutionCourseDto> courses = institutionCourseService.getCoursesByInstitution(institutionId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/institution/{institutionId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or (hasAnyRole('INSTITUTION_ADMIN', 'INSTITUTION_TEACHER') and @institutionSecurity.hasInstitutionAccess(#institutionId))")
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> getCoursesByInstitutionAndStatus(
            @PathVariable Long institutionId,
            @PathVariable CourseStatus status) {
        List<InstitutionCourseDto> courses = institutionCourseService.getCoursesByInstitutionAndStatus(institutionId, status);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> searchCourses(@RequestParam String query) {
        List<InstitutionCourseDto> courses = institutionCourseService.searchCourses(query);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAnyRole('INSTITUTION_ADMIN', 'INSTITUTION_STAFF')")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> createCourse(@Valid @RequestBody InstitutionCourseCreateDto courseCreateDto) {
        InstitutionCourseDto createdCourse = institutionCourseService.createCourse(courseCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdCourse, "Institution course created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @institutionCourseSecurity.canManageCourse(#id)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody InstitutionCourseDto courseUpdateDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.updateCourse(id, courseUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Institution course updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @institutionCourseSecurity.canDeleteCourse(#id)")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        institutionCourseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Institution course deleted successfully"));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN') or @institutionCourseSecurity.canManageCourse(#id)")
    public ResponseEntity<ApiResponse<String>> uploadCourseImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {
        String imagePath = institutionCourseService.uploadCourseImage(id, image);
        return ResponseEntity.ok(ApiResponse.success(imagePath, "Image uploaded successfully"));
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> enrollStudentInCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId) {
        boolean enrolled = institutionCourseService.enrollStudentInCourse(courseId, userId);
        if (enrolled) {
            return ResponseEntity.ok(ApiResponse.success(true, "Student enrolled in course successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to enroll student", "Student may already be enrolled or course settings don't allow enrollment"));
        }
    }
}