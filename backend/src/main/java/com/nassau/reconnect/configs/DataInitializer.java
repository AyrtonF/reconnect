package com.nassau.reconnect.configs;


import com.nassau.reconnect.models.*;
import com.nassau.reconnect.models.enums.*;
import com.nassau.reconnect.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final CouponRepository couponRepository;
    private final ChallengeRepository challengeRepository;
    private final FamilyRepository familyRepository;
    private final PostRepository postRepository;
    private final StudentCourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Initializing sample data...");

        // Create default institutions first
        createDefaultInstitutions();

        // Create users
        User admin = createAdmin();
        User user1 = createUser("André", "andre@gmail.com");
        User user2 = createUser("Maria", "maria@gmail.com");

        // Create institution

        // Create family
        Family family = createFamily(Arrays.asList(user1, user2));

        // Create challenges
        Challenge challenge1 = createChallenge("Fazer uma Caminhada", "Caminhada de 5km com familiares e amigos",
                100, ChallengeType.PHYSICAL, family);
        Challenge challenge2 = createChallenge("Ler um Livro", "Ler um livro de pelo menos 100 páginas",
                50, ChallengeType.INTELLECTUAL, family);

        // Create posts
        createPost(user1, family, "Corrida no parque...", 10);
        createPost(user2, family, "Pedalada em família!", 15);

        // Create coupons
        createCoupon("Desconto 15% em Cursos", "Cupom de 15% de desconto em qualquer curso da plataforma",
                500, LocalDateTime.now().plusMonths(1));
        createCoupon("Curso Grátis", "Resgate um curso gratuito à sua escolha",
                1000, LocalDateTime.now().plusMonths(2));

        // Create courses
        createCourse();

        log.info("Sample data initialization complete!");
    }

    private User createAdmin() {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@mentestudy.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setScore(0);

        return userRepository.save(admin);
    }

    private User createUser(String name, String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password"));
        user.setRole(Role.USER);
        user.setScore(name.equals("André") ? 800 : 500);

        return userRepository.save(user);
    }


    private Family createFamily(List<User> members) {
        Family family = new Family();
        family.setName("Família Feliz");

        Family savedFamily = familyRepository.save(family);

        // Add members to family
        for (User user : members) {
            user.getFamilies().add(savedFamily);
            userRepository.save(user);
        }

        return savedFamily;
    }

    private Challenge createChallenge(String title, String description, int score, ChallengeType type, Family family) {
        Challenge challenge = new Challenge();
        challenge.setTitle(title);
        challenge.setDescription(description);
        challenge.setScore(score);
        challenge.setType(type);
        challenge.setStatus(ChallengeStatus.NOT_STARTED);
        challenge.setChecks(0);
        challenge.setFamily(family);

        return challengeRepository.save(challenge);
    }

    private Post createPost(User user, Family family, String caption, int likes) {
        Post post = new Post();
        post.setUser(user);
        post.setFamily(family);
        post.setCaption(caption);
        post.setLikes(likes);
        post.setTimestamp(LocalDateTime.now());

        return postRepository.save(post);
    }

    private Coupon createCoupon(String title, String description, int scoreRequired, LocalDateTime validUntil) {
        Coupon coupon = new Coupon();
        coupon.setTitle(title);
        coupon.setDescription(description);
        coupon.setScoreRequired(scoreRequired);
        coupon.setValidUntil(validUntil);

        return couponRepository.save(coupon);
    }

    private StudentCourse createCourse() {
        StudentCourse course = new StudentCourse();
        course.setTitle("Os riscos da exposição à internet na adolescência");
        course.setDescription("Aprenda a identificar e prevenir os principais riscos da exposição de crianças e adolescentes na internet.");
        course.setInstructor("Maria Silva");
        course.setWorkload(90);
        course.setCategory("Segurança Digital");
        course.setLevel(CourseLevel.BEGINNER);
        course.setPrice(99.90);

        course.setTags(new ArrayList<>(Arrays.asList("segurança", "internet", "adolescentes")));

        // Create progress
        StudentCourse.CourseProgress progress = new StudentCourse.CourseProgress();
        progress.setCompleted(0);
        progress.setTotal(10);
        progress.setPercentageCompleted(0);
        progress.setStatus(CourseProgressStatus.NOT_STARTED);
        course.setProgress(progress);

        // Create score
        StudentCourse.CourseScore score = new StudentCourse.CourseScore();
        score.setCurrent(0);
        score.setTotal(100);
        course.setScore(score);

        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

        // Create module
        CourseModule module = new CourseModule();
        module.setTitle("Introdução à Segurança Digital");
        module.setDescription("Conceitos básicos de segurança na internet");
        module.setOrder(1);
        module.setProgress(0);
        module.setLocked(false);
        module.setCourse(course);

        // Create module content
        CourseModule.ModuleContent content = new CourseModule.ModuleContent();
        module.setContent(content);

        course.setModules(new ArrayList<>(Collections.singletonList(module)));

        return courseRepository.save(course);
    }

    private void createDefaultInstitutions() {
        // Criar a instituição "Secretaria de Educação" com ID 1 se não existir
        if (!institutionRepository.existsById(1L)) {
            log.info("Creating default institution: Secretaria de Educação");

            Institution secretariaEducacao = new Institution();
            secretariaEducacao.setId(1L);
            secretariaEducacao.setName("Secretaria de Educação");
            secretariaEducacao.setEmail("contato@secretariaeducacao.gov.br");
            secretariaEducacao.setPhone("(81) 3183-8000");
            secretariaEducacao.setDescription("Secretaria de Educação responsável pela gestão educacional");
            secretariaEducacao.setStatus(InstitutionStatus.ACTIVE);

            Institution.Settings settings = new Institution.Settings();
            settings.setAllowEnrollment(true);
            settings.setRequireApproval(false);
            settings.setMaxStudentsPerCourse(100);
            secretariaEducacao.setSettings(settings);

            Institution.SocialMedia socialMedia = new Institution.SocialMedia();
            socialMedia.setWebsite("https://secretariaeducacao.gov.br");
            socialMedia.setFacebook("secretariaeducacao");
            socialMedia.setInstagram("secretaria_educacao");
            secretariaEducacao.setSocialMedia(socialMedia);

            institutionRepository.save(secretariaEducacao);
            log.info("Successfully created Secretaria de Educação with ID: 1");
        } else {
            log.info("Secretaria de Educação already exists with ID: 1");
        }
    }
}
