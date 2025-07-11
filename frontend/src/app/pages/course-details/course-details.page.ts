import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { CourseInstitutionService } from 'src/app/services/course-institution.service';
import {
  StudentCourse as Course,
  CourseModule,
  StudentVideo as Video,
  TextMaterial,
  Quiz,
  Achievement,
  QuizAttempt,
} from '../../models/types';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.page.html',
  styleUrls: ['./course-details.page.scss'],
  standalone: false,
})
export class CourseDetailsPage implements OnInit {
  courseId: number = 0;
  isInstitutional: boolean = false;
  course$ = new BehaviorSubject<Course | null>(null);
  currentModule: CourseModule | null = null;
  selectedSegment: 'videos' | 'materials' | 'quizzes' = 'videos';
  showQuizModal = false;
  currentQuiz: Quiz | null = null;

  constructor(
    private courseService: CourseService,
    private institutionCourseService: CourseInstitutionService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      if (id) {
        this.courseId = +id;

        // Ler queryParams para determinar o tipo
        this.route.queryParams.subscribe((queryParams) => {
          const type = queryParams['type'];
          this.isInstitutional = type === 'institutional';

          console.log('CourseDetailsPage.ngOnInit - Parâmetros recebidos:', {
            courseId: this.courseId,
            type,
            isInstitutional: this.isInstitutional,
            queryParams,
            params,
          });

          this.loadCourse();
        });
      }
    });
  }

  loadCourse() {
    console.log('CourseDetailsPage.loadCourse - Carregando curso:', {
      courseId: this.courseId,
      isInstitutional: this.isInstitutional,
      serviceUrl: this.isInstitutional ? 'institution-courses' : 'courses',
    });

    if (this.isInstitutional) {
      console.log(
        'CourseDetailsPage.loadCourse - Usando serviço institucional para curso:',
        this.courseId
      );

      this.institutionCourseService.getCourseById(this.courseId).subscribe({
        next: (response) => {
          console.log(
            'CourseDetailsPage.loadCourse - Resposta curso institucional:',
            { response, success: response.success, hasData: !!response.data }
          );

          if (response.success && response.data) {
            const instCourse = response.data;
            console.log(
              'CourseDetailsPage.loadCourse - Dados do curso institucional:',
              { instCourse }
            );

            // Converter curso institucional para o formato Course
            const course: Course = {
              id: instCourse.id,
              title: instCourse.name,
              description: instCourse.description,
              thumbnail:
                instCourse.image ||
                '../../../assets/images/course-placeholder.jpg',
              instructor: 'Instrutor Institucional',
              workload: 0,
              category: 'Institucional',
              level: 'beginner',
              price: 0,
              modules: [
                {
                  id: 1,
                  title: 'Módulo Principal',
                  description: 'Conteúdo do curso',
                  order: 1,
                  isLocked: false,
                  progress: 0,
                  content: {
                    videos:
                      instCourse.videos?.map((v, index) => ({
                        id: index + 1,
                        title: v.title,
                        description: v.description || '',
                        duration: v.duration || 0,
                        url: v.url || '',
                        thumbnail:
                          v.thumbnail ||
                          '../../../assets/images/video-placeholder.jpg',
                        isWatched: false,
                        watchedDuration: 0,
                        lastWatchedAt: new Date(),
                      })) || [],
                    textMaterials:
                      instCourse.materials?.map((m, index) => ({
                        id: index + 1,
                        title: m.title,
                        content: m.description || '',
                        estimatedReadTime: 10,
                        isRead: false,
                        attachments: [],
                      })) || [],
                    quizzes: [], // Removido porque não existe em InstitutionCourse
                  },
                },
              ],
              // ...existing progress and other properties...
              progress: {
                completed: 0,
                total: 1,
                percentageCompleted: 0,
                status: 'not_started' as const,
                lastAccessDate: new Date(),
              },
              score: {
                current: 0,
                total: 100,
                achievements: [],
              },
              isEnrolled: true,
              createdAt: new Date(instCourse.createdAt || Date.now()),
              updatedAt: new Date(instCourse.updatedAt || Date.now()),
              tags: [],
              prerequisites: [],
            };

            console.log('CourseDetailsPage.loadCourse - Curso convertido:', {
              convertedCourse: course,
            });

            this.course$.next(course);
            if (course.modules.length > 0) {
              this.currentModule = course.modules[0];
            }
          } else {
            console.error(
              'CourseDetailsPage.loadCourse - Resposta inválida do curso institucional:',
              { response }
            );
          }
        },
        error: (error) => {
          console.error(
            'CourseDetailsPage.loadCourse - Erro ao carregar curso institucional:',
            {
              error,
              courseId: this.courseId,
              status: error.status,
              statusText: error.statusText,
              errorBody: error.error,
            }
          );
          // Tratar erro adequadamente
        },
      });
    } else {
      console.log(
        'CourseDetailsPage.loadCourse - Usando serviço regular para curso:',
        this.courseId
      );

      this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          console.log(
            'CourseDetailsPage.loadCourse - Curso regular carregado:',
            { course }
          );

          this.course$.next(course);
          if (course.modules.length > 0) {
            this.currentModule = course.modules[0];
          }
        },
        error: (error) => {
          console.error(
            'CourseDetailsPage.loadCourse - Erro ao carregar curso regular:',
            {
              error,
              courseId: this.courseId,
              status: error.status,
              statusText: error.statusText,
              errorBody: error.error,
            }
          );
          // Tratar erro adequadamente
        },
      });
    }
  }

  selectModule(module: CourseModule) {
    this.currentModule = module;
  }

  moduleProgress(module: CourseModule): number {
    if (!module?.content) return 0;

    const total =
      (module.content.videos?.length || 0) +
      (module.content.textMaterials?.length || 0) +
      (module.content.quizzes?.length || 0);

    if (total === 0) return 0;

    const completed =
      (module.content.videos?.filter((v) => v.isWatched)?.length || 0) +
      (module.content.textMaterials?.filter((t) => t.isRead)?.length || 0) +
      (module.content.quizzes?.filter((q) => q.isCompleted)?.length || 0);

    return Math.round((completed / total) * 100);
  }

  playVideo(video: Video) {
    if (!this.currentModule) return;

    // Aqui você implementaria a lógica de reprodução do vídeo
    console.log('Reproduzindo vídeo:', video.title);

    if (!video.isWatched) {
      const course = this.course$.getValue();
      if (course) {
        video.isWatched = true;
        video.lastWatchedAt = new Date();
        this.updateCourseProgress();
      }
    }
  }

  readMaterial(material: TextMaterial) {
    if (!this.currentModule) return;

    // Aqui você implementaria a lógica de exibição do material
    console.log('Abrindo material:', material.title);

    if (!material.isRead) {
      const course = this.course$.getValue();
      if (course) {
        material.isRead = true;
        this.updateCourseProgress();
      }
    }
  }

  private updateCourseProgress() {
    const course = this.course$.getValue();
    if (!course) return;

    const totalItems = course.modules.reduce(
      (total, module) => total + this.calculateModuleItems(module),
      0
    );

    const completedItems = course.modules.reduce(
      (total, module) => total + this.calculateCompletedItems(module),
      0
    );

    course.progress = {
      completed: completedItems,
      total: totalItems,
      percentageCompleted: Math.round((completedItems / totalItems) * 100),
      lastAccessDate: new Date(),
      status: completedItems === totalItems ? 'completed' : 'in_progress',
    };

    this.course$.next(course);
  }

  private calculateModuleItems(module: CourseModule): number {
    return (
      (module.content.videos?.length || 0) +
      (module.content.textMaterials?.length || 0) +
      (module.content.quizzes?.length || 0)
    );
  }

  private calculateCompletedItems(module: CourseModule): number {
    return (
      (module.content.videos?.filter((v) => v.isWatched)?.length || 0) +
      (module.content.textMaterials?.filter((t) => t.isRead)?.length || 0) +
      (module.content.quizzes?.filter((q) => q.isCompleted)?.length || 0)
    );
  }

  // ... constructor e outros métodos permanecem iguais

  // Adicione o método startQuiz
  startQuiz(quiz: Quiz) {
    if (!this.currentModule) return;

    this.currentQuiz = quiz;
    this.showQuizModal = true;

    // Aqui você implementaria a lógica de exibição do quiz
    console.log('Iniciando quiz:', quiz.title);

    if (!quiz.isCompleted) {
      const course = this.course$.getValue();
      if (course) {
        // Aqui você pode implementar a lógica específica do quiz
        // Por enquanto, vamos apenas marcar como completo
        quiz.isCompleted = true;
        this.updateCourseProgress();
      }
    }
  }

  // Se você quiser implementar a funcionalidade completa do quiz, adicione estes métodos
  submitQuiz(answers: { questionId: number; answer: string | number }[]) {
    if (!this.currentQuiz || !this.currentModule) return;

    const score = this.calculateQuizScore(answers);

    this.currentQuiz.isCompleted = true;
    this.showQuizModal = false;
    this.updateCourseProgress();
  }

  private calculateQuizScore(
    answers: { questionId: number; answer: string | number }[]
  ): number {
    if (!this.currentQuiz) return 0;

    const correctAnswers = answers.filter((answer) => {
      const question = this.currentQuiz?.questions.find(
        (q) => q.id === answer.questionId
      );
      return question?.correctAnswer === answer.answer;
    }).length;

    return Math.round(
      (correctAnswers / this.currentQuiz.questions.length) * 100
    );
  }
}
