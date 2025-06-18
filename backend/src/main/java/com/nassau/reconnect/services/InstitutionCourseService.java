package com.nassau.reconnect.services;

import com.nassau.reconnect.dtos.instituition.InstitutionCourseCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.InstitutionCourseMapper;
import com.nassau.reconnect.models.Institution;
import com.nassau.reconnect.models.InstitutionCourse;
import com.nassau.reconnect.models.User;
import com.nassau.reconnect.models.enums.CourseStatus;
import com.nassau.reconnect.repositories.InstitutionCourseRepository;
import com.nassau.reconnect.repositories.InstitutionRepository;
import com.nassau.reconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstitutionCourseService {

    private final InstitutionCourseRepository institutionCourseRepository;
    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final InstitutionCourseMapper institutionCourseMapper;

    @Value("${upload.dir:uploads/}")
    private String uploadDir;

    public List<InstitutionCourseDto> getAllCourses() {
        return institutionCourseRepository.findAll().stream()
                .map(institutionCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public InstitutionCourseDto getCourseById(Long id) {
        return institutionCourseRepository.findById(id)
                .map(institutionCourseMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + id));
    }

    public List<InstitutionCourseDto> getCoursesByInstitution(Long institutionId) {
        return institutionCourseRepository.findByInstitutionId(institutionId).stream()
                .map(institutionCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<InstitutionCourseDto> getCoursesByInstitutionAndStatus(Long institutionId, CourseStatus status) {
        return institutionCourseRepository.findByInstitutionIdAndStatus(institutionId, status).stream()
                .map(institutionCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<InstitutionCourseDto> searchCourses(String query) {
        return institutionCourseRepository.findByNameContainingIgnoreCase(query).stream()
                .map(institutionCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstitutionCourseDto createCourse(InstitutionCourseCreateDto courseCreateDto) {
        InstitutionCourse course = institutionCourseMapper.toEntity(courseCreateDto);

        // Set institution
        Institution institution = institutionRepository.findById(courseCreateDto.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found with id: " + courseCreateDto.getInstitutionId()));
        course.setInstitution(institution);

        // Set default settings if not provided
        if (course.getSettings() == null) {
            course.setSettings(new InstitutionCourse.CourseSettings(true, false, 100));
        }

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto updateCourse(Long id, InstitutionCourseDto courseUpdateDto) {
        InstitutionCourse course = institutionCourseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + id));

        // Update basic fields
        course.setName(courseUpdateDto.getName());
        course.setDescription(courseUpdateDto.getDescription());
        course.setImage(courseUpdateDto.getImage());
        course.setStatus(courseUpdateDto.getStatus());

        // Update settings if provided
        if (courseUpdateDto.getSettings() != null) {
            InstitutionCourse.CourseSettings settings = new InstitutionCourse.CourseSettings(
                    courseUpdateDto.getSettings().isAllowEnrollment(),
                    courseUpdateDto.getSettings().isRequireApproval(),
                    courseUpdateDto.getSettings().getMaxStudents()
            );
            course.setSettings(settings);
        }

        InstitutionCourse updatedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!institutionCourseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Institution course not found with id: " + id);
        }

        institutionCourseRepository.deleteById(id);
    }

    @Transactional
    public String uploadCourseImage(Long courseId, MultipartFile image) throws IOException {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save file
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update course with image path
        String imagePath = "/" + uploadDir + uniqueFileName;
        course.setImage(imagePath);
        institutionCourseRepository.save(course);

        return imagePath;
    }

    @Transactional
    public boolean enrollStudentInCourse(Long courseId, Long userId) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if enrollment is allowed
        if (course.getSettings() != null && !course.getSettings().isAllowEnrollment()) {
            return false;
        }

        // Check if max students limit is reached
        if (course.getSettings() != null && course.getSettings().getMaxStudents() != null) {
            if (course.getStudentsEnrolled().size() >= course.getSettings().getMaxStudents()) {
                return false;
            }
        }

        // Check if user is already enrolled
        if (course.getStudentsEnrolled().contains(user)) {
            return false;
        }

        // Enroll student
        course.getStudentsEnrolled().add(user);
        institutionCourseRepository.save(course);

        return true;
    }
}