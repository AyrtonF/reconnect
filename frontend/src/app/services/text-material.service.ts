import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TextMaterial, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class TextMaterialService {
  private apiUrl = `${environment.apiUrl}/text-materials`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAllTextMaterials(): Observable<TextMaterial[]> {
    return this.http.get<ApiResponse<TextMaterial[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getTextMaterialById(id: number): Observable<TextMaterial | undefined> {
    return this.http
      .get<ApiResponse<TextMaterial>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError(this.errorHandler.handleError)
      );
  }

  getTextMaterialsByCourse(courseId: number): Observable<TextMaterial[]> {
    return this.http
      .get<ApiResponse<TextMaterial[]>>(`${this.apiUrl}/course/${courseId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getTextMaterialsByModule(moduleId: number): Observable<TextMaterial[]> {
    return this.http
      .get<ApiResponse<TextMaterial[]>>(`${this.apiUrl}/module/${moduleId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  addTextMaterial(
    textMaterial: Partial<TextMaterial>
  ): Observable<TextMaterial> {
    return this.http
      .post<ApiResponse<TextMaterial>>(`${this.apiUrl}`, textMaterial)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  updateTextMaterial(
    id: number,
    updatedTextMaterial: Partial<TextMaterial>
  ): Observable<TextMaterial> {
    return this.http
      .put<ApiResponse<TextMaterial>>(
        `${this.apiUrl}/${id}`,
        updatedTextMaterial
      )
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteTextMaterial(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.success),
      catchError(this.errorHandler.handleError)
    );
  }
}
