package com.nassau.reconnect.services;


import com.nassau.reconnect.dtos.course.StudentCourseDto;
import com.nassau.reconnect.exceptions.ResourceNotFoundException;
import com.nassau.reconnect.mappers.StudentCourseMapper;
import com.nassau.reconnect.models.*;
import com.nassau.reconnect.models.enums.CourseLevel;
import com.nassau.reconnect.models.enums.CourseProgressStatus;
import com.nassau.reconnect.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentCourseService {

    private final StudentCourseRepository studentCourseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final StudentVideoRepository videoRepository;
    private final TextMaterialRepository materialRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final StudentCourseMapper studentCourseMapper;

    public List<StudentCourseDto> getAllCourses() {
        return studentCourseRepository.findAll().stream()
                .map(studentCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public StudentCourseDto getCourseById(Long id) {
        return studentCourseRepository.findById(id)
                .map(studentCourseMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public List<StudentCourseDto> getCoursesByCategory(String category) {
        return studentCourseRepository.findByCategory(category).stream()
                .map(studentCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StudentCourseDto> getCoursesByLevel(CourseLevel level) {
        return studentCourseRepository.findByLevel(level).stream()
                .map(studentCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StudentCourseDto> getCoursesByTag(String tag) {
        return studentCourseRepository.findByTag(tag).stream()
                .map(studentCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StudentCourseDto> searchCourses(String query) {
        return studentCourseRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query)
                .stream()
                .map(studentCourseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean enrollInCourse(Long courseId, Long userId) {
        StudentCourse course = studentCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is already enrolled
        if (user.getCourses().contains(course)) {
            return false;
        }

        // Enroll user in course
        user.getCourses().add(course);
        userRepository.save(user);

        return true;
    }

    @Transactional
    public StudentCourseDto updateVideoProgress(Long courseId, Long moduleId, Long videoId, Long userId) {
        StudentCourse course = studentCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is enrolled
        if (!user.getCourses().contains(course)) {
            throw new IllegalStateException("User is not enrolled in this course");
        }

        // Find the video
        Optional<StudentVideo> videoOpt;
        if (moduleId != null) {
            CourseModule module = courseModuleRepository.findById(moduleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

            videoOpt = module.getContent().getVideos().stream()
                    .filter(v -> v.getId().equals(videoId))
                    .findFirst();
        } else {
            videoOpt = videoRepository.findById(videoId);
        }

        StudentVideo video = videoOpt
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        // Mark video as watched
        video.setWatched(true);
        video.setWatchedDuration(video.getDuration());
        video.setLastWatchedAt(LocalDateTime.now());
        videoRepository.save(video);

        // Update course progress
        updateCourseProgress(course);

        return studentCourseMapper.toDto(course);
    }

    @Transactional
    public StudentCourseDto updateMaterialProgress(Long courseId, Long moduleId, Long materialId, Long userId) {
        StudentCourse course = studentCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is enrolled
        if (!user.getCourses().contains(course)) {
            throw new IllegalStateException("User is not enrolled in this course");
        }

        // Find the material
        Optional<TextMaterial> materialOpt;
        if (moduleId != null) {
            CourseModule module = courseModuleRepository.findById(moduleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

            materialOpt = module.getContent().getTextMaterials().stream()
                    .filter(m -> m.getId().equals(materialId))
                    .findFirst();
        } else {
            materialOpt = materialRepository.findById(materialId);
        }

        TextMaterial material = materialOpt
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + materialId));

        // Mark material as read
        material.setRead(true);
        materialRepository.save(material);

        // Update course progress
        updateCourseProgress(course);

        return studentCourseMapper.toDto(course);
    }

    @Transactional
    public StudentCourseDto updateQuizProgress(Long courseId, Long moduleId, Long quizId, Long userId, Integer score) {
        StudentCourse course = studentCourseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is enrolled
        if (!user.getCourses().contains(course)) {
            throw new IllegalStateException("User is not enrolled in this course");
        }

        // Find the quiz
        Optional<Quiz> quizOpt;
        if (moduleId != null) {
            CourseModule module = courseModuleRepository.findById(moduleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + moduleId));

            quizOpt = module.getContent().getQuizzes().stream()
                    .filter(q -> q.getId().equals(quizId))
                    .findFirst();
        } else {
            quizOpt = quizRepository.findById(quizId);
        }

        Quiz quiz = quizOpt
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        // Create quiz attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStartedAt(LocalDateTime.now().minusMinutes(5)); // Assume started 5 minutes ago
        attempt.setCompletedAt(LocalDateTime.now());
        attempt.setScore(score);

        // Add attempt to quiz
        quiz.getAttempts().add(attempt);

        // Check if score meets minimum score requirement
        if (score >= quiz.getMinimumScore()) {
            quiz.setCompleted(true);

            // Update best score if needed
            if (quiz.getBestScore() == null || score > quiz.getBestScore()) {
                quiz.setBestScore(score);
            }
        }

        quizRepository.save(quiz);

        // Update course progress
        updateCourseProgress(course);

        return studentCourseMapper.toDto(course);
    }

    /**
     * Updates the progress of a course based on completed videos, materials, and quizzes.
     */
    private void updateCourseProgress(StudentCourse course) {
        int totalItems = 0;
        int completedItems = 0;

        for (CourseModule module : course.getModules()) {
            // Count all items
            totalItems += module.getContent().getVideos().size();
            totalItems += module.getContent().getTextMaterials().size();
            totalItems += module.getContent().getQuizzes().size();

            // Count completed items
            completedItems += module.getContent().getVideos().stream().filter(StudentVideo::isWatched).count();
            completedItems += module.getContent().getTextMaterials().stream().filter(TextMaterial::isRead).count();
            completedItems += module.getContent().getQuizzes().stream().filter(Quiz::isCompleted).count();

            // Calculate module progress
            int moduleProgress = (totalItems > 0)
                    ? (int) (((double) completedItems / totalItems) * 100)
                    : 0;

            module.setProgress(moduleProgress);
        }

        // Calculate overall course progress
        StudentCourse.CourseProgress progress = course.getProgress();
        if (progress == null) {
            progress = new StudentCourse.CourseProgress();
            course.setProgress(progress);
        }

        progress.setTotal(totalItems);
        progress.setCompleted(completedItems);
        progress.setPercentageCompleted(totalItems > 0 ? (completedItems * 100 / totalItems) : 0);
        progress.setLastAccessDate(LocalDateTime.now());

        // Update course status
        if (completedItems == 0) {
            progress.setStatus(CourseProgressStatus.NOT_STARTED);
        } else if (completedItems < totalItems) {
            progress.setStatus(CourseProgressStatus.IN_PROGRESS);
        } else {
            progress.setStatus(CourseProgressStatus.COMPLETED);
        }

        studentCourseRepository.save(course);
    }
}