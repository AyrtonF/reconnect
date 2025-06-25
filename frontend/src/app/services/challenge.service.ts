import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Challenge, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private apiUrl = `${environment.apiUrl}/challenges`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAllChallenges(): Observable<Challenge[]> {
    return this.http.get<ApiResponse<Challenge[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getChallengeById(id: number): Observable<Challenge> {
    return this.http.get<ApiResponse<Challenge>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  addChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http
      .post<ApiResponse<Challenge>>(`${this.apiUrl}`, challenge)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  updateChallenge(id: number, challenge: Challenge): Observable<Challenge> {
    return this.http
      .put<ApiResponse<Challenge>>(`${this.apiUrl}/${id}`, challenge)
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  deleteChallenge(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.errorHandler.handleError)
    );
  }

  getChallengesByFamily(familyId: number): Observable<Challenge[]> {
    return this.http
      .get<ApiResponse<Challenge[]>>(`${this.apiUrl}/family/${familyId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getChallengesByStatus(status: string): Observable<Challenge[]> {
    return this.http
      .get<ApiResponse<Challenge[]>>(`${this.apiUrl}/status/${status}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getChallengesByType(type: string): Observable<Challenge[]> {
    return this.http
      .get<ApiResponse<Challenge[]>>(`${this.apiUrl}/type/${type}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  participateInChallenge(
    challengeId: number,
    userId: number
  ): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${this.apiUrl}/${challengeId}/participate/${userId}`,
        {}
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }

  completeChallenge(challengeId: number, userId: number): Observable<boolean> {
    return this.http
      .post<ApiResponse<boolean>>(
        `${this.apiUrl}/${challengeId}/complete/${userId}`,
        {}
      )
      .pipe(
        map((response) => response.data || false),
        catchError(this.errorHandler.handleError)
      );
  }
}
