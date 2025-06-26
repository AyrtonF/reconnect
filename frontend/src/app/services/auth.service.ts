import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/types';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  role: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'INSTITUTION_ADMIN' | 'INSTITUTION_STAFF';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    // Validação básica no frontend
    if (!email || !password) {
      return throwError(() => new Error('Email e senha são obrigatórios'));
    }

    if (!this.isValidEmail(email)) {
      return throwError(() => new Error('Email inválido'));
    }

    const loginRequest: LoginRequest = {
      email: email.trim(),
      password: password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    console.log('Enviando dados de login:', {
      email: loginRequest.email,
      password: '***',
    });

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, loginRequest, {
        headers,
      })
      .pipe(
        map((response) => {
          console.log('Resposta da API:', response);

          if (response.success && response.data) {
            // Adiciona "Bearer " se não estiver presente no token
            const token = response.data.token.startsWith('Bearer ')
              ? response.data.token
              : `Bearer ${response.data.token}`;

            return {
              token: token,
              role: response.data.role,
            };
          } else {
            throw new Error(
              response.error || response.message || 'Login failed'
            );
          }
        }),
        catchError((error) => {
          console.error('Erro completo da API:', error);

          let errorMessage = 'Erro ao fazer login';

          // Tratamento específico para erro 400
          if (error.status === 400) {
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.error) {
              // Se o error for uma string
              errorMessage =
                typeof error.error === 'string'
                  ? error.error
                  : 'Dados inválidos';
            } else {
              errorMessage = 'Dados de login inválidos';
            }
          } else if (error.status === 401) {
            errorMessage = 'Credenciais inválidas';
          } else if (error.status === 0) {
            errorMessage =
              'Erro de conexão. Verifique se o servidor está rodando.';
          } else {
            errorMessage = error.message || 'Erro desconhecido';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    role: 'USER' | 'ADMIN' | 'INSTITUTION_ADMIN' | 'INSTITUTION_STAFF' = 'USER'
  ): Observable<AuthResponse> {
    // Validação básica no frontend
    if (!name || !email || !password) {
      return throwError(() => new Error('Todos os campos são obrigatórios'));
    }

    if (!this.isValidEmail(email)) {
      return throwError(() => new Error('Email inválido'));
    }

    if (password.length < 6) {
      return throwError(
        () => new Error('A senha deve ter no mínimo 6 caracteres')
      );
    }

    const registerRequest: RegisterRequest = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    console.log('Enviando dados de registro:', {
      name: registerRequest.name,
      email: registerRequest.email,
      password: '***',
      role: registerRequest.role,
    });

    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${this.apiUrl}/register`,
        registerRequest,
        { headers }
      )
      .pipe(
        map((response) => {
          console.log('Resposta da API (registro):', response);

          if (response.success && response.data) {
            // Adiciona "Bearer " se não estiver presente no token
            const token = response.data.token.startsWith('Bearer ')
              ? response.data.token
              : `Bearer ${response.data.token}`;

            return {
              token: token,
              role: response.data.role,
            };
          } else {
            throw new Error(
              response.error || response.message || 'Registration failed'
            );
          }
        }),
        catchError((error) => {
          console.error('Erro completo da API (registro):', error);

          let errorMessage = 'Erro ao registrar usuário';

          if (error.status === 400) {
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Dados de registro inválidos';
            }
          } else if (error.status === 0) {
            errorMessage =
              'Erro de conexão. Verifique se o servidor está rodando.';
          } else {
            errorMessage = error.message || 'Erro desconhecido';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Método para obter a rota de redirecionamento baseada no role
  getRedirectRoute(role: string): string {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return '/home'; // Redireciona para home até criar página específica de admin
      case 'INSTITUTION_ADMIN':
        return '/course-institution'; // Página específica para administradores de instituição
      case 'INSTITUTION_STAFF':
        return '/home-company'; // Página específica para staff da empresa
      case 'USER':
      default:
        return '/home'; // Página padrão para usuários
    }
  }

  // Método auxiliar para validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para salvar o token no localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obter o token do localStorage
  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (token && !token.startsWith('Bearer ')) {
      return `Bearer ${token}`;
    }
    return token;
  }

  // Método para salvar o role do usuário
  saveUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  // Método para obter o role do usuário
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Método para salvar o ID do usuário
  saveUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  // Método para obter o ID do usuário
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  // Método para salvar o ID da instituição
  saveInstitutionId(institutionId: number): void {
    localStorage.setItem('institutionId', institutionId.toString());
  }

  // Método para obter o ID da instituição
  getInstitutionId(): number | null {
    // const institutionId = localStorage.getItem('institutionId');
    // return institutionId ? parseInt(institutionId, 10) : null;

    return 1;
  }

  // Método para obter informações do usuário atual do backend
  getCurrentUser(): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${environment.apiUrl}/users/me`)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  // Método para remover dados de autenticação
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('institutionId');
  }

  // Método para verificar se o usuário está logado
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  // Método para verificar se o usuário tem uma role específica
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Métodos de conveniência para verificar roles específicas
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isInstitutionAdmin(): boolean {
    return this.hasRole('INSTITUTION_ADMIN');
  }

  isInstitutionStaff(): boolean {
    return this.hasRole('INSTITUTION_STAFF');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }

  // Método para tratamento de erros genérico
  private handleError(error: any): Observable<never> {
    console.error('Erro completo da API:', error);

    let errorMessage = 'Erro desconhecido';

    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
    } else if (error.status === 401) {
      errorMessage = 'Token inválido ou expirado';
    } else if (error.status === 403) {
      errorMessage = 'Acesso negado';
    }

    return throwError(() => new Error(errorMessage));
  }
}
