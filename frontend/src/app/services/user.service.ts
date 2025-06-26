import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, ApiResponse } from '../models/types';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export type UserType = 'standard' | 'institutional';

export interface InstitutionalUser extends User {
  userType: 'institutional';
  institutionId: number;
  permissions: {
    canCreateCourses: boolean;
    canEditCourses: boolean;
    canDeleteCourses: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
  };
}

interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'INSTITUTION_ADMIN';
  institutionId?: number;
  phone?: string;
  avatar?: string;
}

interface UserUpdateRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  password?: string;
}

interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  institutionId?: number;
  phone?: string;
  score?: number;
  avatar?: string;
  coursesIds?: number[];
  familyIds?: number[];
  challengesCompletedIds?: number[];
  pendingChallengesIds?: number[];
  imagesOfChallenge?: string[];
  couponsIds?: number[];
  posts?: number[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obter headers com autorização
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token || '',
    });
  }

  // Converter UserDto para User
  private mapDtoToUser(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role: dto.role,
      institutionId: dto.institutionId,
      phone: dto.phone,
      score: dto.score,
      avatar: dto.avatar,
      coursesIds: dto.coursesIds,
      familyIds: dto.familyIds,
      challengesCompletedIds: dto.challengesCompletedIds,
      pendingChallengesIds: dto.pendingChallengesIds,
      imagesOfChallenge: dto.imagesOfChallenge,
      couponsIds: dto.couponsIds,
      posts: dto.posts,
    };
  }

  // Obter todos os usuários (apenas para admin/institution_admin)
  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UserDto[]>>(`${this.apiUrl}`, { headers })
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return response.data.map((dto) => this.mapDtoToUser(dto));
          } else {
            throw new Error(response.error || 'Failed to fetch users');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar usuários:', error);
          let errorMessage = 'Erro ao buscar usuários';

          if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Obter usuário por ID
  getUserById(id: number): Observable<User | undefined> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UserDto>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return this.mapDtoToUser(response.data);
          } else {
            throw new Error(response.error || 'User not found');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar usuário:', error);
          let errorMessage = 'Erro ao buscar usuário';

          if (error.status === 404) {
            errorMessage = 'Usuário não encontrado';
          } else if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Obter usuário atual (logado)
  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UserDto>>(`${this.apiUrl}/me`, { headers })
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return this.mapDtoToUser(response.data);
          } else {
            throw new Error(response.error || 'Failed to fetch current user');
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar usuário atual:', error);
          let errorMessage = 'Erro ao buscar dados do usuário';

          if (error.status === 401) {
            errorMessage = 'Token inválido ou expirado';
            // Logout automático se token inválido
            this.authService.logout();
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Obter usuários por instituição
  getUsersByInstitution(institutionId: number): Observable<User[]> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UserDto[]>>(
        `${this.apiUrl}/institution/${institutionId}`,
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return response.data.map((dto) => this.mapDtoToUser(dto));
          } else {
            throw new Error(
              response.error || 'Failed to fetch institution users'
            );
          }
        }),
        catchError((error) => {
          console.error('Erro ao buscar usuários da instituição:', error);
          let errorMessage = 'Erro ao buscar usuários da instituição';

          if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Criar novo usuário
  addUser(user: User | InstitutionalUser): Observable<User> {
    const headers = this.getAuthHeaders();

    const createRequest: UserCreateRequest = {
      name: user.name,
      email: user.email,
      password: user.password || '123456', // Senha padrão se não fornecida
      role: user.role.toUpperCase() as 'USER' | 'ADMIN' | 'INSTITUTION_ADMIN',
      institutionId: user.institutionId,
      phone: user.phone,
      avatar: user.avatar,
    };

    return this.http
      .post<ApiResponse<UserDto>>(`${this.apiUrl}`, createRequest, { headers })
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return this.mapDtoToUser(response.data);
          } else {
            throw new Error(response.error || 'Failed to create user');
          }
        }),
        catchError((error) => {
          console.error('Erro ao criar usuário:', error);
          let errorMessage = 'Erro ao criar usuário';

          if (error.status === 400) {
            errorMessage = 'Dados inválidos para criação do usuário';
          } else if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Atualizar usuário
  updateUser(
    updatedUser: User | InstitutionalUser
  ): Observable<User | undefined> {
    const headers = this.getAuthHeaders();

    const updateRequest: UserUpdateRequest = {
      name: updatedUser.name,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      // Só inclui password se foi fornecida
      ...(updatedUser.password && { password: updatedUser.password }),
    };

    return this.http
      .put<ApiResponse<UserDto>>(
        `${this.apiUrl}/${updatedUser.id}`,
        updateRequest,
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return this.mapDtoToUser(response.data);
          } else {
            throw new Error(response.error || 'Failed to update user');
          }
        }),
        catchError((error) => {
          console.error('Erro ao atualizar usuário:', error);
          let errorMessage = 'Erro ao atualizar usuário';

          if (error.status === 400) {
            errorMessage = 'Dados inválidos para atualização';
          } else if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.status === 404) {
            errorMessage = 'Usuário não encontrado';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Deletar usuário
  deleteUser(id: number): Observable<boolean> {
    const headers = this.getAuthHeaders();

    return this.http
      .delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map((response) => {
          if (response.success) {
            return true;
          } else {
            throw new Error(response.error || 'Failed to delete user');
          }
        }),
        catchError((error) => {
          console.error('Erro ao deletar usuário:', error);
          let errorMessage = 'Erro ao deletar usuário';

          if (error.status === 401) {
            errorMessage = 'Acesso não autorizado';
          } else if (error.status === 403) {
            errorMessage = 'Permissão negada';
          } else if (error.status === 404) {
            errorMessage = 'Usuário não encontrado';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Métodos para compatibilidade com código existente
  getInstitutionalUsers(): Observable<InstitutionalUser[]> {
    return this.getAllUsers().pipe(
      map(
        (users) =>
          users.filter(
            (user) =>
              user.role === 'institution_admin' ||
              user.role === 'institution_teacher' ||
              user.role === 'institution_staff'
          ) as InstitutionalUser[]
      )
    );
  }

  // Verificar se email já existe (método auxiliar)
  checkEmailExists(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((users) => users.some((user) => user.email === email)),
      catchError(() => {
        // Se não conseguir buscar usuários, assume que email não existe
        return throwError(() => new Error('Erro ao verificar email'));
      })
    );
  }
}
