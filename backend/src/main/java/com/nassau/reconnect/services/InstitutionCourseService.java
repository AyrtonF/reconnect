package com.nassau.reconnect.services;

import com.nassau.reconnect.dtos.instituition.InstitutionCourseCreateDto;
import com.nassau.reconnect.dtos.instituition.InstitutionCourseDto;
import com.nassau.reconnect.dtos.instituition.InstitutionMaterialDto;
import com.nassau.reconnect.dtos.instituition.InstitutionVideoDto;
import com.nassau.reconnect.dtos.instituition.InstitutionQuestionDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.InstitutionCourseMapper;
import com.nassau.reconnect.models.Institution;
import com.nassau.reconnect.models.InstitutionCourse;
import com.nassau.reconnect.models.InstitutionMaterial;
import com.nassau.reconnect.models.InstitutionVideo;
import com.nassau.reconnect.models.InstitutionQuestion;
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
import java.time.LocalDateTime;
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
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Institution not found with id: " + courseCreateDto.getInstitutionId()));
        course.setInstitution(institution);

        // Set default settings if not provided
        if (course.getSettings() == null) {
            course.setSettings(new InstitutionCourse.CourseSettings(true, false, 100));
        }

        // Clear any existing content to start fresh
        course.getMaterials().clear();
        course.getVideos().clear();
        course.getQuestions().clear();

        // Save course first to get ID
        InstitutionCourse savedCourse = institutionCourseRepository.save(course);

        // Process and save materials, videos, and questions if provided
        if (courseCreateDto.getMaterials() != null && !courseCreateDto.getMaterials().isEmpty()) {
            for (InstitutionMaterialDto materialDto : courseCreateDto.getMaterials()) {
                if (materialDto != null) {
                    InstitutionMaterial material = createMaterialFromDto(materialDto, savedCourse);
                    savedCourse.addMaterial(material);
                }
            }
        }

        if (courseCreateDto.getVideos() != null && !courseCreateDto.getVideos().isEmpty()) {
            for (InstitutionVideoDto videoDto : courseCreateDto.getVideos()) {
                if (videoDto != null) {
                    InstitutionVideo video = createVideoFromDto(videoDto, savedCourse);
                    savedCourse.addVideo(video);
                }
            }
        }

        if (courseCreateDto.getQuestions() != null && !courseCreateDto.getQuestions().isEmpty()) {
            for (InstitutionQuestionDto questionDto : courseCreateDto.getQuestions()) {
                if (questionDto != null) {
                    InstitutionQuestion question = createQuestionFromDto(questionDto, savedCourse);
                    savedCourse.addQuestion(question);
                }
            }
        }

        // Save course again with all content
        InstitutionCourse finalSavedCourse = institutionCourseRepository.save(savedCourse);
        return institutionCourseMapper.toDto(finalSavedCourse);
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
                    courseUpdateDto.getSettings().getMaxStudents());
            course.setSettings(settings);
        }

        // Update materials if provided
        if (courseUpdateDto.getMaterials() != null) {
            course.getMaterials().clear();
            courseUpdateDto.getMaterials().forEach(materialDto -> {
                if (materialDto != null) {
                    course.getMaterials().add(createMaterialFromDto(materialDto, course));
                }
            });
        }

        // Update videos if provided
        if (courseUpdateDto.getVideos() != null) {
            course.getVideos().clear();
            courseUpdateDto.getVideos().forEach(videoDto -> {
                if (videoDto != null) {
                    course.getVideos().add(createVideoFromDto(videoDto, course));
                }
            });
        }

        // Update questions if provided
        if (courseUpdateDto.getQuestions() != null) {
            course.getQuestions().clear();
            courseUpdateDto.getQuestions().forEach(questionDto -> {
                if (questionDto != null) {
                    course.getQuestions().add(createQuestionFromDto(questionDto, course));
                }
            });
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

    // Helper methods for creating entities from DTOs
    private InstitutionMaterial createMaterialFromDto(InstitutionMaterialDto dto, InstitutionCourse course) {
        InstitutionMaterial material = new InstitutionMaterial();
        // Course will be set by the addMaterial method
        material.setTitle(dto.getTitle());
        material.setDescription(dto.getDescription());
        material.setFilename(dto.getFilename());
        material.setType(dto.getType());
        material.setSize(dto.getSize());
        material.setUploadedAt(LocalDateTime.now());
        material.setUpdatedAt(LocalDateTime.now());
        return material;
    }

    private InstitutionVideo createVideoFromDto(InstitutionVideoDto dto, InstitutionCourse course) {
        InstitutionVideo video = new InstitutionVideo();
        // Course will be set by the addVideo method
        video.setTitle(dto.getTitle());
        video.setDescription(dto.getDescription());
        video.setFilename(dto.getFilename());
        video.setDuration(dto.getDuration());
        video.setThumbnail(dto.getThumbnail());
        video.setUrl(dto.getUrl());
        video.setUploadedAt(LocalDateTime.now());
        video.setUpdatedAt(LocalDateTime.now());
        return video;
    }

    private InstitutionQuestion createQuestionFromDto(InstitutionQuestionDto dto, InstitutionCourse course) {
        InstitutionQuestion question = new InstitutionQuestion();
        // Course will be set by the addQuestion method
        question.setQuestion(dto.getQuestion());
        question.setAlternatives(dto.getAlternatives());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return question;
    }

    // Methods for managing individual content items
    @Transactional
    public InstitutionCourseDto addVideoToCourse(Long courseId, InstitutionVideoDto videoDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionVideo video = createVideoFromDto(videoDto, course);
        course.getVideos().add(video);

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto updateCourseVideo(Long courseId, Long videoId, InstitutionVideoDto videoDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionVideo video = course.getVideos().stream()
                .filter(v -> v.getId().equals(videoId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        // Update video fields
        video.setTitle(videoDto.getTitle());
        video.setDescription(videoDto.getDescription());
        video.setFilename(videoDto.getFilename());
        video.setDuration(videoDto.getDuration());
        video.setThumbnail(videoDto.getThumbnail());
        video.setUrl(videoDto.getUrl());
        video.setUpdatedAt(LocalDateTime.now());

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto removeVideoFromCourse(Long courseId, Long videoId) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        boolean removed = course.getVideos().removeIf(v -> v.getId().equals(videoId));
        if (!removed) {
            throw new ResourceNotFoundException("Video not found with id: " + videoId);
        }

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto addMaterialToCourse(Long courseId, InstitutionMaterialDto materialDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionMaterial material = createMaterialFromDto(materialDto, course);
        course.getMaterials().add(material);

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto updateCourseMaterial(Long courseId, Long materialId,
            InstitutionMaterialDto materialDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionMaterial material = course.getMaterials().stream()
                .filter(m -> m.getId().equals(materialId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + materialId));

        // Update material fields
        material.setTitle(materialDto.getTitle());
        material.setDescription(materialDto.getDescription());
        material.setFilename(materialDto.getFilename());
        material.setType(materialDto.getType());
        material.setSize(materialDto.getSize());
        material.setUpdatedAt(LocalDateTime.now());

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto removeMaterialFromCourse(Long courseId, Long materialId) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        boolean removed = course.getMaterials().removeIf(m -> m.getId().equals(materialId));
        if (!removed) {
            throw new ResourceNotFoundException("Material not found with id: " + materialId);
        }

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto addQuestionToCourse(Long courseId, InstitutionQuestionDto questionDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionQuestion question = createQuestionFromDto(questionDto, course);
        course.getQuestions().add(question);

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto updateCourseQuestion(Long courseId, Long questionId,
            InstitutionQuestionDto questionDto) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        InstitutionQuestion question = course.getQuestions().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        // Update question fields
        question.setQuestion(questionDto.getQuestion());
        question.setAlternatives(questionDto.getAlternatives());
        question.setCorrectAnswer(questionDto.getCorrectAnswer());
        question.setUpdatedAt(LocalDateTime.now());

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }

    @Transactional
    public InstitutionCourseDto removeQuestionFromCourse(Long courseId, Long questionId) {
        InstitutionCourse course = institutionCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution course not found with id: " + courseId));

        boolean removed = course.getQuestions().removeIf(q -> q.getId().equals(questionId));
        if (!removed) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }

        InstitutionCourse savedCourse = institutionCourseRepository.save(course);
        return institutionCourseMapper.toDto(savedCourse);
    }
}