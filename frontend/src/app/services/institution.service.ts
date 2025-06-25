import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Institution, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private apiUrl = `${environment.apiUrl}/institutions`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  getAllInstitutions(): Observable<Institution[]> {
    return this.http.get<ApiResponse<Institution[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getInstitutionById(id: number): Observable<Institution> {
    return this.http.get<ApiResponse<Institution>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  getInstitutionsByStatus(status: string): Observable<Institution[]> {
    return this.http
      .get<ApiResponse<Institution[]>>(`${this.apiUrl}/status/${status}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  createInstitution(
    institution: Partial<Institution>
  ): Observable<Institution> {
    return this.http
      .post<ApiResponse<Institution>>(`${this.apiUrl}`, institution)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  updateInstitution(
    id: number,
    institution: Partial<Institution>
  ): Observable<Institution> {
    return this.http
      .put<ApiResponse<Institution>>(`${this.apiUrl}/${id}`, institution)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteInstitution(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.errorHandler.handleError)
    );
  }

  searchInstitutions(query: string): Observable<Institution[]> {
    const params = new HttpParams().set('query', query);
    return this.http
      .get<ApiResponse<Institution[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }
}
