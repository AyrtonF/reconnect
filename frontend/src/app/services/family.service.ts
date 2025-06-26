import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Family, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private apiUrl = `${environment.apiUrl}/families`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  getAllFamilies(): Observable<Family[]> {
    return this.http.get<ApiResponse<Family[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getFamilyById(id: number): Observable<Family> {
    return this.http.get<ApiResponse<Family>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  getUserFamilies(userId: number): Observable<Family[]> {
    return this.http
      .get<ApiResponse<Family[]>>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  searchFamiliesByName(name: string): Observable<Family[]> {
    const params = new HttpParams().set('name', name);
    return this.http
      .get<ApiResponse<Family[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  addFamily(family: Omit<Family, 'id'>): Observable<Family> {
    return this.http.post<ApiResponse<Family>>(`${this.apiUrl}`, family).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  updateFamily(id: number, family: Omit<Family, 'id'>): Observable<Family> {
    return this.http
      .put<ApiResponse<Family>>(`${this.apiUrl}/${id}`, family)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteFamily(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.errorHandler.handleError)
    );
  }

  joinFamily(familyId: number, userId: number): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${this.apiUrl}/${familyId}/members/${userId}`,
        {}
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  leaveFamily(familyId: number, userId: number): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(
        `${this.apiUrl}/${familyId}/members/${userId}`
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  // Métodos de conveniência para trabalhar com o usuário atual
  joinFamilyCurrentUser(familyId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.joinFamily(familyId, userId);
  }

  leaveFamilyCurrentUser(familyId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.leaveFamily(familyId, userId);
  }

  getCurrentUserFamilies(): Observable<Family[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.getUserFamilies(userId);
  }
}
