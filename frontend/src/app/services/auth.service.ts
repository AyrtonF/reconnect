import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/types';

interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock de usuários em memória
  private mockUsers: User[] = [
    { id: 1, name: 'André', email: 'andre@gmail.com', password: '123456', role: 'user' },
    { id: 2, name: 'Maria', email: 'maria@gmail.com', password: 'senha123', role: 'admin' },
    { id: 3, name: 'João', email: 'joao@gmail.com', password: 'abc123', role: 'user' },
    { id: 4, name: 'Joao Silva', email: 'joao.silva@mentestudy.com', password: '123456', role: 'institution_admin' },
  ];

  constructor() { }

  login(email: string, password: string): Observable<AuthResponse> {
    const user = this.mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // Simulação de geração de um token (apenas uma string aleatória)
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      return of({ token: `Bearer ${token}`, role: user.role });
    } else {
      return throwError(() => new Error('Credenciais inválidas'));
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    // Verifica se o email já existe
    const existingUser = this.mockUsers.find(u => u.email === email);
    if (existingUser) {
      return throwError(() => new Error('Este email já está cadastrado.'));
    }

    // Simula a criação de um novo usuário
    const newUser: User = {
      id: this.generateId(), // Simula a geração de um ID
      name: name,
      email: email,
      password: password,
      role: 'user', 
    };

    this.mockUsers.push(newUser);

    // Simula a geração de um token para o novo usuário
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return of({ token: `Bearer ${token}`, role: newUser.role });
  }

  private generateId(): number {
    if (this.mockUsers.length === 0) {
      return 1;
    }
    return Math.max(...this.mockUsers.map(user => user.id)) + 1;
  }
}