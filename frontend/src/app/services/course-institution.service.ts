import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse, InstitutionCourse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CourseInstitutionService {
  private apiUrl = `${environment.apiUrl}/institution-courses`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

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
  createCourse(
    courseData: Partial<InstitutionCourse>
  ): Observable<ApiResponse<InstitutionCourse>> {
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
}
