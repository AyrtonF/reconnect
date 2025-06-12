import { Injectable } from '@angular/core';
import { 
  StudentCourse as Course, 
  CourseModule, 
  StudentVideo as Video, 
  TextMaterial, 
  Quiz, 
  Achievement, 
  QuizAttempt,
  InstitutionCourse
} from '../models/types';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseInstitutionService } from './course-institution.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
    {
      id: 1,
      title: 'Os riscos da exposição à internet na adolescência',
      description: 'Aprenda a identificar e prevenir os principais riscos da exposição de crianças e adolescentes na internet.',
      instructor: 'Maria Silva',
      thumbnail: '../../../assets/images/course1.png',
      workload: 90,
      category: 'Segurança Digital',
      level: 'beginner',
      price: 99.90,
      isEnrolled: true,
      enrollmentDate: new Date('2025-05-01'),
      modules: [
        {
          id: 1,
          title: 'Introdução à Segurança Digital',
          description: 'Conceitos básicos de segurança na internet',
          order: 1,
          isLocked: false,
          progress: 100,
          content: {
            videos: [
              {
                id: 1,
                title: 'Fundamentos de Segurança Digital',
                description: 'Aprenda os conceitos básicos',
                duration: 1200,
                url: 'assets/videos/aula1.mp4',
                thumbnail: '../../../assets/images/course2.png',
                isWatched: true,
                watchedDuration: 1200,
                lastWatchedAt: new Date('2025-05-10')
              }
            ],
            textMaterials: [
              {
                id: 1,
                title: 'Guia de Segurança Online',
                content: 'Conteúdo detalhado sobre segurança...',
                estimatedReadTime: 15,
                isRead: true,
                attachments: [
                  {
                    name: 'guia-pratico.pdf',
                    url: 'assets/materials/guia-pratico.pdf',
                    type: 'application/pdf'
                  }
                ]
              }
            ],
            quizzes: [
              {
                id: 1,
                title: 'Quiz - Fundamentos',
                description: 'Teste seus conhecimentos',
                questions: [
                  {
                    id: 1,
                    text: 'Qual é a primeira medida de segurança online?',
                    type: 'multiple_choice',
                    options: ['Senha forte', 'Antivírus', 'Firewall'],
                    correctAnswer: 0,
                    points: 10
                  }
                ],
                timeLimit: 15,
                minimumScore: 70,
                attempts: [],
                isCompleted: false
              }
            ]
          }
        }
      ],
      progress: {
        completed: 8,
        total: 10,
        percentageCompleted: 80,
        lastAccessDate: new Date('2025-05-14'),
        status: 'in_progress'
      },
      score: {
        current: 150,
        total: 200,
        achievements: [
          {
            id: 1,
            title: 'Primeiro Módulo Concluído',
            description: 'Completou o primeiro módulo do curso',
            points: 50,
            earnedAt: new Date('2025-05-05'),
            type: 'completion',
            icon: 'assets/icons/achievement-module.png'
          }
        ]
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-05-14'),
      tags: ['segurança', 'internet', 'adolescentes'],
      prerequisites: []
    },
    {
      id: 2,
      title: 'Segurança Digital para Crianças',
      description: 'Curso voltado para crianças sobre segurança na internet.',
      instructor: 'João Pereira',
      thumbnail: '../../../assets/images/course2.png',
      workload: 120,
      category: 'Segurança Digital',
      level: 'beginner',
      price: 79.90,
      isEnrolled: false,
      enrollmentDate: new Date('2025-05-01'),
      modules: [
        {
          id: 1,
          title: 'Módulo 1 - Introdução à Segurança Digital',
          description: 'Conceitos básicos de segurança na internet',
          order: 1,
          isLocked: true,
          progress: 0,
          content: {
            videos: [],
            textMaterials: [],
            quizzes: []
          }
        }
      ],
      progress: {
        completed: 0,
        total: 10,
        percentageCompleted: 0,
        lastAccessDate: new Date('2025-05-14'),
        status: 'not_started'
      },
      score: {
        current: 0,
        total: 100,
        achievements: []
      },
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-05-14'),
      tags: ['segurança', 'internet', 'crianças'],
      prerequisites: []
    }
  ];

  constructor(private courseInstitutionService: CourseInstitutionService) {}

  getAllCourses(): Observable<Course[]> {
    return combineLatest([
      of(this.courses),
      this.courseInstitutionService.getCourses()
    ]).pipe(
      map(([regularCourses, institutionalCourses]) => {
        const convertedInstitutionalCourses: Course[] = institutionalCourses.map(instCourse => ({
          id: instCourse.id + 1000, // Evitar conflito de IDs
          title: instCourse.name,
          description: instCourse.description,
          instructor: 'Instrutor Institucional',
          thumbnail: instCourse.image || '../../../assets/images/course-placeholder.jpg',
          workload: 0,
          category: 'Institucional',
          level: 'beginner',
          price: 0,
          isEnrolled: false,
          enrollmentDate: instCourse.createdAt,
          modules: [],
          progress: {
            completed: 0,
            total: 0,
            percentageCompleted: 0,
            lastAccessDate: new Date(),
            status: 'not_started'
          },
          score: {
            current: 0,
            total: 0,
            achievements: []
          },
          createdAt: instCourse.createdAt,
          updatedAt: instCourse.updatedAt,
          tags: [],
          prerequisites: []
        }));

        return [...regularCourses, ...convertedInstitutionalCourses].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
      })
    );
  }

  enrollInCourse(courseId: number): Observable<Course | undefined> {
  const course = this.courses.find(c => c.id === courseId);
  if (!course) return of(undefined);

  course.isEnrolled = true;
  course.enrollmentDate = new Date();
  course.progress = {
    completed: 0,
    total: this.calculateTotalItems(course),
    percentageCompleted: 0,
    lastAccessDate: new Date(),
    status: 'in_progress'
  };

  return this.updateCourse(course);
}

  getCourseById(id: number): Observable<Course | undefined> {
    // Se o ID é maior que 1000, é um curso institucional
    if (id > 1000) {
      return this.courseInstitutionService.getCourseById(id - 1000).pipe(
        map(response => {
          if (!response.success || !response.data) return undefined;
          const instCourse = response.data;
          return {
            id: instCourse.id + 1000,
            title: instCourse.name,
            description: instCourse.description,
            instructor: 'Instrutor Institucional',
            thumbnail: instCourse.image || '../../../assets/images/course-placeholder.jpg',
            workload: 0,
            category: 'Institucional',
            level: 'beginner',
            price: 0,
            isEnrolled: false,
            enrollmentDate: instCourse.createdAt,
            modules: [],
            progress: {
              completed: 0,
              total: 0,
              percentageCompleted: 0,
              lastAccessDate: new Date(),
              status: 'not_started'
            },
            score: {
              current: 0,
              total: 0,
              achievements: []
            },
            createdAt: instCourse.createdAt,
            updatedAt: instCourse.updatedAt,
            tags: [],
            prerequisites: []
          };
        })
      );
    }

    const course = this.courses.find(course => course.id === id);
    return of(course);
  }

  addCourse(course: Course): Observable<Course> {
    course.id = this.generateId();
    course.createdAt = new Date();
    course.updatedAt = new Date();
    course.progress = {
      completed: 0,
      total: this.calculateTotalItems(course),
      percentageCompleted: 0,
      status: 'not_started'
    };
    this.courses.push(course);
    return of(course);
  }

  updateCourse(updatedCourse: Course): Observable<Course | undefined> {
    const index = this.courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      updatedCourse.updatedAt = new Date();
      this.courses[index] = updatedCourse;
      return of(updatedCourse);
    }
    return of(undefined);
  }

  deleteCourse(id: number): Observable<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => course.id !== id);
    return of(this.courses.length < initialLength);
  }

  updateCourseProgress(courseId: number, moduleId: number, contentType: 'video' | 'text' | 'quiz', contentId: number): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return of(undefined);

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return of(undefined);

    switch (contentType) {
      case 'video':
        const video = module.content.videos.find(v => v.id === contentId);
        if (video) video.isWatched = true;
        break;
      case 'text':
        const text = module.content.textMaterials.find(t => t.id === contentId);
        if (text) text.isRead = true;
        break;
      case 'quiz':
        const quiz = module.content.quizzes.find(q => q.id === contentId);
        if (quiz) quiz.isCompleted = true;
        break;
    }

    this.recalculateProgress(course);
    return this.updateCourse(course);
  }

  private recalculateProgress(course: Course): void {
    const totalItems = this.calculateTotalItems(course);
    const completedItems = this.calculateCompletedItems(course);
    
    course.progress = {
      completed: completedItems,
      total: totalItems,
      percentageCompleted: Math.round((completedItems / totalItems) * 100),
      lastAccessDate: new Date(),
      status: completedItems === totalItems ? 'completed' : 'in_progress'
    };
  }

  private calculateTotalItems(course: Course): number {
    return course.modules.reduce((total, module) => {
      return total + 
        module.content.videos.length +
        module.content.textMaterials.length +
        module.content.quizzes.length;
    }, 0);
  }

  private calculateCompletedItems(course: Course): number {
    return course.modules.reduce((total, module) => {
      return total +
        module.content.videos.filter(v => v.isWatched).length +
        module.content.textMaterials.filter(t => t.isRead).length +
        module.content.quizzes.filter(q => q.isCompleted).length;
    }, 0);
  }

  private generateId(): number {
    if (this.courses.length === 0) {
      return 1;
    }
    return Math.max(...this.courses.map(course => course.id)) + 1;
  }

  addAchievement(courseId: number, achievement: Achievement): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return of(undefined);

    course.score.achievements.push(achievement);
    course.score.current += achievement.points;
    return this.updateCourse(course);
  }

  submitQuizAttempt(courseId: number, moduleId: number, quizId: number, attempt: QuizAttempt): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return of(undefined);

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return of(undefined);

    const quiz = module.content.quizzes.find(q => q.id === quizId);
    if (!quiz) return of(undefined);

    quiz.attempts.push(attempt);
    quiz.bestScore = Math.max(...quiz.attempts.map(a => a.score));
    quiz.isCompleted = quiz.bestScore >= quiz.minimumScore;

    return this.updateCourse(course);
  }
}