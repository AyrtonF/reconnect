import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, combineLatest, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  StudentCourse as Course,
  CourseModule,
  StudentVideo as Video,
  TextMaterial,
  Quiz,
  Achievement,
  QuizAttempt,
  InstitutionCourse,
  ApiResponse,
} from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private institutionApiUrl = `${environment.apiUrl}/institution-courses`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  // Métodos para Student Courses
  getAllCourses(): Observable<Course[]> {
    return combineLatest([
      this.getStudentCourses(),
      this.getInstitutionCourses(),
    ]).pipe(
      map(([studentCourses, institutionCourses]) => {
        const convertedInstitutionalCourses: Course[] = institutionCourses.map(
          (instCourse) => this.convertInstitutionToStudentCourse(instCourse)
        );
        return [...studentCourses, ...convertedInstitutionalCourses].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  getStudentCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getInstitutionCourses(): Observable<InstitutionCourse[]> {
    return this.http
      .get<ApiResponse<InstitutionCourse[]>>(`${this.institutionApiUrl}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getCourseById(id: number): Observable<Course> {
    // Se o ID é maior que 1000, é um curso institucional convertido
    if (id > 1000) {
      return this.http
        .get<ApiResponse<InstitutionCourse>>(
          `${this.institutionApiUrl}/${id - 1000}`
        )
        .pipe(
          map((response) => {
            if (!response.data) throw new Error('Course not found');
            return this.convertInstitutionToStudentCourse(response.data, id);
          }),
          catchError(this.errorHandler.handleError)
        );
    }

    return this.http.get<ApiResponse<Course>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.http
      .get<ApiResponse<Course[]>>(
        `${this.apiUrl}/category/${encodeURIComponent(category)}`
      )
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getCoursesByLevel(level: string): Observable<Course[]> {
    return this.http
      .get<ApiResponse<Course[]>>(`${this.apiUrl}/level/${level}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getCoursesByTag(tag: string): Observable<Course[]> {
    return this.http
      .get<ApiResponse<Course[]>>(
        `${this.apiUrl}/tag/${encodeURIComponent(tag)}`
      )
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  searchCourses(query: string): Observable<Course[]> {
    const params = new HttpParams().set('query', query);
    return this.http
      .get<ApiResponse<Course[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  enrollInCourse(courseId: number, userId: number): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${this.apiUrl}/${courseId}/enroll/${userId}`,
        {}
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  // Métodos para atualizar progresso
  updateVideoProgress(
    courseId: number,
    videoId: number,
    userId: number,
    moduleId?: number
  ): Observable<Course> {
    const params = moduleId
      ? new HttpParams().set('moduleId', moduleId.toString())
      : new HttpParams();
    return this.http
      .put<ApiResponse<Course>>(
        `${this.apiUrl}/${courseId}/progress/video/${videoId}/user/${userId}`,
        {},
        { params }
      )
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  updateMaterialProgress(
    courseId: number,
    materialId: number,
    userId: number,
    moduleId?: number
  ): Observable<Course> {
    const params = moduleId
      ? new HttpParams().set('moduleId', moduleId.toString())
      : new HttpParams();
    return this.http
      .put<ApiResponse<Course>>(
        `${this.apiUrl}/${courseId}/progress/material/${materialId}/user/${userId}`,
        {},
        { params }
      )
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  updateQuizProgress(
    courseId: number,
    quizId: number,
    userId: number,
    score: number,
    moduleId?: number
  ): Observable<Course> {
    const params = moduleId
      ? new HttpParams()
          .set('moduleId', moduleId.toString())
          .set('score', score.toString())
      : new HttpParams().set('score', score.toString());

    return this.http
      .put<ApiResponse<Course>>(
        `${this.apiUrl}/${courseId}/progress/quiz/${quizId}/user/${userId}`,
        {},
        { params }
      )
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  // Métodos de conveniência (mantidos para compatibilidade)
  updateCourseProgress(
    courseId: number,
    moduleId: number,
    contentType: 'video' | 'text' | 'quiz',
    contentId: number
  ): Observable<Course> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    switch (contentType) {
      case 'video':
        return this.updateVideoProgress(courseId, contentId, userId, moduleId);
      case 'text':
        return this.updateMaterialProgress(
          courseId,
          contentId,
          userId,
          moduleId
        );
      case 'quiz':
        return this.updateQuizProgress(
          courseId,
          contentId,
          userId,
          100,
          moduleId
        ); // Score padrão
      default:
        return throwError(() => new Error('Invalid content type'));
    }
  }

  // Método de conveniência para matrícula sem precisar passar userId
  enrollInCourseCurrentUser(courseId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.enrollInCourse(courseId, userId);
  }

  addAchievement(
    courseId: number,
    achievement: Achievement
  ): Observable<Course> {
    // Este método seria implementado quando o backend suportar achievements
    return throwError(() => new Error('Method not implemented in backend yet'));
  }

  submitQuizAttempt(
    courseId: number,
    moduleId: number,
    quizId: number,
    attempt: QuizAttempt
  ): Observable<Course> {
    // Este método seria implementado quando o backend suportar quiz attempts
    return throwError(() => new Error('Method not implemented in backend yet'));
  }

  // Método auxiliar para converter InstitutionCourse para Course
  private convertInstitutionToStudentCourse(
    instCourse: InstitutionCourse,
    overrideId?: number
  ): Course {
    return {
      id: overrideId || instCourse.id + 1000, // Evitar conflito de IDs
      title: instCourse.name,
      description: instCourse.description,
      instructor: 'Instrutor Institucional',
      thumbnail:
        instCourse.image || '../../../assets/images/course-placeholder.jpg',
      workload: 0,
      category: 'Institucional',
      level: 'beginner' as const,
      price: 0,
      isEnrolled: false,
      enrollmentDate: instCourse.createdAt,
      modules: [], // Seria convertido se o backend fornecesse módulos estruturados
      progress: {
        completed: 0,
        total: 0,
        percentageCompleted: 0,
        lastAccessDate: new Date(),
        status: 'not_started' as const,
      },
      score: {
        current: 0,
        total: 0,
        achievements: [],
      },
      createdAt: instCourse.createdAt,
      updatedAt: instCourse.updatedAt,
      tags: [],
      prerequisites: [],
    };
  }
}
