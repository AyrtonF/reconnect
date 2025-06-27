import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('CourseService.getAuthHeaders - Token disponível:', !!token);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

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

        // Garantir que todos os cursos tenham datas válidas antes da ordenação
        const allCourses = [
          ...studentCourses,
          ...convertedInstitutionalCourses,
        ].map((course) => ({
          ...course,
          createdAt: this.ensureDate(course.createdAt),
          updatedAt: this.ensureDate(course.updatedAt),
        }));

        return allCourses.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  getStudentCourses(): Observable<Course[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Course[]>>(`${this.apiUrl}`, { headers })
      .pipe(
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

  getCourseById(id: number, isInstitutional?: boolean): Observable<Course> {
    // Usar parâmetro isInstitutional ou tentar ambos os endpoints
    if (isInstitutional) {
      return this.http
        .get<ApiResponse<InstitutionCourse>>(`${this.institutionApiUrl}/${id}`)
        .pipe(
          map((response) => {
            if (!response.data) throw new Error('Course not found');
            return this.convertInstitutionToStudentCourse(response.data);
          }),
          catchError(this.errorHandler.handleError)
        );
    }

    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Course>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
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
    const userId = this.authService.getUserId();
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
    const userId = this.authService.getUserId();
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

  // Função auxiliar para conversão segura de datas
  private ensureDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') return new Date(dateValue);
    return new Date();
  }

  // Método auxiliar para converter InstitutionCourse para Course
  private convertInstitutionToStudentCourse(
    instCourse: InstitutionCourse,
    overrideId?: number
  ): Course {
    // Converter strings de data para objetos Date de forma segura
    const createdAt = this.ensureDate(instCourse.createdAt);
    const updatedAt = this.ensureDate(instCourse.updatedAt);

    return {
      id: overrideId || instCourse.id, // Usar ID real do curso institucional
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
      enrollmentDate: createdAt,
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
      createdAt: createdAt,
      updatedAt: updatedAt,
      tags: [],
      prerequisites: [],
      // Adicionar propriedades para identificar como curso institucional
      institutionId: instCourse.institutionId,
      isInstitutional: true,
    } as Course;
  }

  // Método para marcar curso como matriculado localmente
  markCourseAsEnrolled(courseId: number): void {
    // Este método seria usado para atualizar o estado local do curso
    console.log(`Curso ${courseId} marcado como matriculado localmente`);
  }

  // Método simplificado para obter cursos sem depender de endpoints específicos
  getCoursesForExploration(): Observable<Course[]> {
    return this.getAllCourses().pipe(
      map((courses) => {
        // Por enquanto, retornar todos os cursos
        // Futuramente, filtrar baseado em matrículas conhecidas
        return courses;
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  // Método para obter cursos matriculados
  getEnrolledCourses(userId?: number): Observable<Course[]> {
    const userIdToUse = userId || this.authService.getUserId();
    console.log(
      'CourseService.getEnrolledCourses - Iniciando busca de cursos matriculados:',
      {
        userId: userIdToUse,
        hasToken: !!this.authService.getToken(),
      }
    );

    if (!userIdToUse) {
      console.error(
        'CourseService.getEnrolledCourses - Usuário não autenticado'
      );
      return throwError(() => new Error('User not authenticated'));
    }

    const url = `${environment.apiUrl}/users/${userIdToUse}/courses`;
    const headers = this.getAuthHeaders();
    console.log('CourseService.getEnrolledCourses - URL da requisição:', url);

    // Usar o endpoint correto do backend
    return this.http.get<ApiResponse<Course[]>>(url, { headers }).pipe(
      map((response) => {
        console.log(
          'CourseService.getEnrolledCourses - Resposta recebida:',
          response
        );
        return response.data || [];
      }),
      catchError((error) => {
        console.error(
          'CourseService.getEnrolledCourses - Erro na requisição:',
          {
            error,
            status: error.status,
            statusText: error.statusText,
            errorBody: error.error,
            url: error.url,
          }
        );
        console.warn(
          'Endpoint de cursos matriculados falhou, usando fallback:',
          error
        );
        // Fallback: obter todos os cursos e filtrar pelos matriculados
        return this.getAllCourses().pipe(
          map((courses) => courses.filter((course) => course.isEnrolled)),
          catchError(() => {
            // Se tudo falhar, retornar array vazio
            console.error('Falha total ao carregar cursos matriculados');
            return [];
          })
        );
      })
    );
  }

  // Método para obter apenas cursos disponíveis (não matriculados)
  getAvailableCourses(): Observable<Course[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return this.getAllCourses();
    }

    return combineLatest([
      this.getAllCourses(),
      this.getEnrolledCourses(userId),
    ]).pipe(
      map(([allCourses, enrolledCourses]) => {
        const enrolledIds = enrolledCourses.map((course: Course) => course.id);
        return allCourses.filter(
          (course: Course) => !enrolledIds.includes(course.id)
        );
      }),
      catchError((error) => {
        console.warn(
          'Erro ao obter cursos disponíveis, retornando todos os cursos:',
          error
        );
        // Em caso de erro, retornar todos os cursos
        return this.getAllCourses();
      })
    );
  }

  // Método para verificar se usuário está matriculado
  isUserEnrolled(courseId: number, userId?: number): Observable<boolean> {
    const userIdToUse = userId || this.authService.getUserId();
    if (!userIdToUse) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http
      .get<ApiResponse<boolean>>(
        `${this.apiUrl}/${courseId}/enrolled/${userIdToUse}`
      )
      .pipe(
        map((response) => response.data || false),
        catchError((error) => {
          console.warn(
            'Endpoint de verificação de matrícula não disponível:',
            error
          );
          // Fallback: assumir que não está matriculado
          return throwError(() => new Error('Cannot verify enrollment status'));
        })
      );
  }
}
