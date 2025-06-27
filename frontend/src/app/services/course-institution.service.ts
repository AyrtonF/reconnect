import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse, InstitutionCourse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseInstitutionService {
  private apiUrl = `${environment.apiUrl}/institution-courses`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log(
      'CourseInstitutionService.getAuthHeaders - Token disponível:',
      !!token
    );
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Obter todos os cursos
  getCourses(): Observable<InstitutionCourse[]> {
    return this.http
      .get<ApiResponse<InstitutionCourse[]>>(`${this.apiUrl}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  // Buscar cursos
  searchCourses(query: string): Observable<InstitutionCourse[]> {
    const params = new HttpParams().set('query', query);
    return this.http
      .get<ApiResponse<InstitutionCourse[]>>(`${this.apiUrl}/search`, {
        params,
      })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  // Obter curso por ID
  getCourseById(id: number): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .get<ApiResponse<InstitutionCourse>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Obter cursos por instituição
  getCoursesByInstitution(
    institutionId: number
  ): Observable<InstitutionCourse[]> {
    return this.http
      .get<ApiResponse<InstitutionCourse[]>>(
        `${this.apiUrl}/institution/${institutionId}`
      )
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  // Obter cursos por instituição e status
  getCoursesByInstitutionAndStatus(
    institutionId: number,
    status: string
  ): Observable<InstitutionCourse[]> {
    return this.http
      .get<ApiResponse<InstitutionCourse[]>>(
        `${this.apiUrl}/institution/${institutionId}/status/${status}`
      )
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  // Criar novo curso
  createCourse(courseData: any): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .post<ApiResponse<InstitutionCourse>>(`${this.apiUrl}`, courseData)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Atualizar curso
  updateCourse(
    courseId: number,
    updates: Partial<InstitutionCourse>
  ): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .put<ApiResponse<InstitutionCourse>>(
        `${this.apiUrl}/${courseId}`,
        updates
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Excluir curso
  deleteCourse(courseId: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${courseId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Upload de imagem
  uploadImage(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/upload-image`, formData)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Adicionar material ao curso
  addMaterial(
    courseId: number,
    material: any
  ): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .post<ApiResponse<InstitutionCourse>>(
        `${this.apiUrl}/${courseId}/materials`,
        material
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Adicionar vídeo ao curso
  addVideo(
    courseId: number,
    video: any
  ): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .post<ApiResponse<InstitutionCourse>>(
        `${this.apiUrl}/${courseId}/videos`,
        video
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Adicionar questão ao curso
  addQuestion(
    courseId: number,
    question: any
  ): Observable<ApiResponse<InstitutionCourse>> {
    return this.http
      .post<ApiResponse<InstitutionCourse>>(
        `${this.apiUrl}/${courseId}/questions`,
        question
      )
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Matricular usuário em curso institucional
  enrollUserInCourse(courseId: number, userId: number): Observable<boolean> {
    const url = `${this.apiUrl}/${courseId}/enroll/${userId}`;
    const headers = this.getAuthHeaders();

    console.log(
      'CourseInstitutionService.enrollUserInCourse - Iniciando matrícula:',
      {
        courseId,
        userId,
        url,
        apiUrl: this.apiUrl,
        hasToken: !!this.authService.getToken(),
      }
    );

    return this.http.post<ApiResponse<boolean>>(url, {}, { headers }).pipe(
      map((response) => {
        console.log(
          'CourseInstitutionService.enrollUserInCourse - Resposta recebida:',
          response
        );
        return response.data || false;
      }),
      catchError((error) => {
        console.error(
          'CourseInstitutionService.enrollUserInCourse - Erro na matrícula:',
          {
            error,
            status: error.status,
            statusText: error.statusText,
            errorBody: error.error,
            url: error.url,
            courseId,
            userId,
          }
        );
        return this.errorHandler.handleError(error);
      })
    );
  }

  // Verificar se usuário está matriculado em curso institucional
  isUserEnrolled(courseId: number, userId: number): Observable<boolean> {
    return this.http
      .get<ApiResponse<boolean>>(
        `${this.apiUrl}/${courseId}/enrollment/${userId}`
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }
}
