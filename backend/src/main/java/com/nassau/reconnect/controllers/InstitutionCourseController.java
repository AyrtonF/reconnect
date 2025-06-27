package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseDto;
import com.nassau.reconnect.dtos.instituition.InstitutionMaterialDto;
import com.nassau.reconnect.dtos.instituition.InstitutionQuestionDto;
import com.nassau.reconnect.dtos.instituition.InstitutionVideoDto;
import com.nassau.reconnect.models.enums.CourseStatus;
import com.nassau.reconnect.services.InstitutionCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> getCoursesByInstitution(
            @PathVariable Long institutionId) {
        List<InstitutionCourseDto> courses = institutionCourseService.getCoursesByInstitution(institutionId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/institution/{institutionId}/status/{status}")
    // @PreAuthorize("hasRole('ADMIN') or (hasAnyRole('INSTITUTION_ADMIN',
    // 'INSTITUTION_TEACHER') and
    // @institutionSecurity.hasInstitutionAccess(#institutionId))")
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> getCoursesByInstitutionAndStatus(
            @PathVariable Long institutionId,
            @PathVariable CourseStatus status) {
        List<InstitutionCourseDto> courses = institutionCourseService.getCoursesByInstitutionAndStatus(institutionId,
                status);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<InstitutionCourseDto>>> searchCourses(@RequestParam String query) {
        List<InstitutionCourseDto> courses = institutionCourseService.searchCourses(query);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN') or hasAnyRole('INSTITUTION_ADMIN',
    // 'INSTITUTION_STAFF')")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> createCourse(
            @Valid @RequestBody InstitutionCourseCreateDto courseCreateDto) {
        InstitutionCourseDto createdCourse = institutionCourseService.createCourse(courseCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdCourse, "Institution course created successfully"));
    }

    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#id)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody InstitutionCourseDto courseUpdateDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.updateCourse(id, courseUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Institution course updated successfully"));
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canDeleteCourse(#id)")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        institutionCourseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Institution course deleted successfully"));
    }

    @PostMapping("/{id}/image")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#id)")
    public ResponseEntity<ApiResponse<String>> uploadCourseImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {
        String imagePath = institutionCourseService.uploadCourseImage(id, image);
        return ResponseEntity.ok(ApiResponse.success(imagePath, "Image uploaded successfully"));
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    // @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> enrollStudentInCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId) {
        boolean enrolled = institutionCourseService.enrollStudentInCourse(courseId, userId);
        if (enrolled) {
            return ResponseEntity.ok(ApiResponse.success(true, "Student enrolled in course successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to enroll student",
                            "Student may already be enrolled or course settings don't allow enrollment"));
        }
    }

    // Endpoints para gerenciar vídeos do curso
    @PostMapping("/{courseId}/videos")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> addVideoToCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody InstitutionVideoDto videoDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.addVideoToCourse(courseId, videoDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Video added to course successfully"));
    }

    @PutMapping("/{courseId}/videos/{videoId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> updateCourseVideo(
            @PathVariable Long courseId,
            @PathVariable Long videoId,
            @Valid @RequestBody InstitutionVideoDto videoDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.updateCourseVideo(courseId, videoId, videoDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Video updated successfully"));
    }

    @DeleteMapping("/{courseId}/videos/{videoId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> removeVideoFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long videoId) {
        InstitutionCourseDto updatedCourse = institutionCourseService.removeVideoFromCourse(courseId, videoId);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Video removed from course successfully"));
    }

    // Endpoints para gerenciar materiais do curso
    @PostMapping("/{courseId}/materials")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> addMaterialToCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody InstitutionMaterialDto materialDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.addMaterialToCourse(courseId, materialDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Material added to course successfully"));
    }

    @PutMapping("/{courseId}/materials/{materialId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> updateCourseMaterial(
            @PathVariable Long courseId,
            @PathVariable Long materialId,
            @Valid @RequestBody InstitutionMaterialDto materialDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.updateCourseMaterial(courseId, materialId,
                materialDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Material updated successfully"));
    }

    @DeleteMapping("/{courseId}/materials/{materialId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> removeMaterialFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long materialId) {
        InstitutionCourseDto updatedCourse = institutionCourseService.removeMaterialFromCourse(courseId, materialId);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Material removed from course successfully"));
    }

    // Endpoints para gerenciar questões do curso
    @PostMapping("/{courseId}/questions")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> addQuestionToCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody InstitutionQuestionDto questionDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.addQuestionToCourse(courseId, questionDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Question added to course successfully"));
    }

    @PutMapping("/{courseId}/questions/{questionId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> updateCourseQuestion(
            @PathVariable Long courseId,
            @PathVariable Long questionId,
            @Valid @RequestBody InstitutionQuestionDto questionDto) {
        InstitutionCourseDto updatedCourse = institutionCourseService.updateCourseQuestion(courseId, questionId,
                questionDto);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Question updated successfully"));
    }

    @DeleteMapping("/{courseId}/questions/{questionId}")
    // @PreAuthorize("hasRole('ADMIN') or
    // @institutionCourseSecurity.canManageCourse(#courseId)")
    public ResponseEntity<ApiResponse<InstitutionCourseDto>> removeQuestionFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long questionId) {
        InstitutionCourseDto updatedCourse = institutionCourseService.removeQuestionFromCourse(courseId, questionId);
        return ResponseEntity.ok(ApiResponse.success(updatedCourse, "Question removed from course successfully"));
    }
}