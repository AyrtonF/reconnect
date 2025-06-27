import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post, ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('PostService.getAuthHeaders - Token disponível:', !!token);
    if (token) {
      console.log(
        'PostService.getAuthHeaders - Token (primeiros 20 chars):',
        token.substring(0, 20) + '...'
      );
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllPosts(): Observable<Post[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}`, { headers })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getPostById(id: number): Observable<Post> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Post>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  getPostsByFamily(familyId: number): Observable<Post[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}/family/${familyId}`, {
        headers,
      })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}/user/${userId}`, { headers })
      .pipe(
        map((response) => response.data || []),
        catchError(this.errorHandler.handleError)
      );
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    console.log('PostService.addPost - Iniciando criação de post:', {
      post,
      apiUrl: this.apiUrl,
      hasToken: !!this.authService.getToken(),
    });

    const headers = this.getAuthHeaders();
    console.log('PostService.addPost - Headers:', headers);

    return this.http
      .post<ApiResponse<Post>>(`${this.apiUrl}`, post, { headers })
      .pipe(
        map((response) => {
          console.log('PostService.addPost - Resposta recebida:', response);
          return response.data!;
        }),
        catchError((error) => {
          console.error('PostService.addPost - Erro ao criar post:', {
            error,
            status: error.status,
            statusText: error.statusText,
            errorBody: error.error,
            url: error.url,
          });
          return this.errorHandler.handleError(error);
        })
      );
  }

  updatePost(id: number, post: Omit<Post, 'id'>): Observable<Post> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<ApiResponse<Post>>(`${this.apiUrl}/${id}`, post, { headers })
      .pipe(
        map((response) => response.data!),
        catchError(this.errorHandler.handleError)
      );
  }

  deletePost(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map(() => void 0),
        catchError(this.errorHandler.handleError)
      );
  }

  likePost(postId: number, userId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<ApiResponse<number>>(
        `${this.apiUrl}/${postId}/like/${userId}`,
        {},
        { headers }
      )
      .pipe(
        map((response) => response.success || false),
        catchError(this.errorHandler.handleError)
      );
  }
}
