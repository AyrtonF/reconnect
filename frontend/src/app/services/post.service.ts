import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}`).pipe(
      map((response) => response.data || []),
      catchError(this.errorHandler.handleError)
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  getPostsByFamily(familyId: number): Observable<Post[]> {
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}/family/${familyId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<ApiResponse<Post>>(`${this.apiUrl}`, post).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  updatePost(id: number, post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.put<ApiResponse<Post>>(`${this.apiUrl}/${id}`, post).pipe(
      map((response) => response.data!),
      catchError(this.errorHandler.handleError)
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.errorHandler.handleError)
    );
  }

  likePost(postId: number, userId: number): Observable<boolean> {
    return this.http
      .post<ApiResponse<number>>(`${this.apiUrl}/${postId}/like/${userId}`, {})
      .pipe(
        map((response) => response.success || false),
        catchError(this.errorHandler.handleError)
      );
  }
}
