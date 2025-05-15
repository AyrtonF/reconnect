import { Injectable } from '@angular/core';
import { User } from '../models/types';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'André',
      email: 'andre@gmail.com',
      password: '12345',
      role: 'user',
      phone: '+55 (81)99999-9999',
      score: 800,
      avatar: '../../../assets/images/marcos.png',
      coursesIds: [1, 2, 3],
      familyIds: [1],
      challengesCompletedIds: [1, 3],
      pendingChallengesIds: [2, 4, 5],
      imagesOfChallenge: ['assets/uploads/desafio1.jpg', 'assets/uploads/desafio2.jpg'],
      couponsIds: [1, 2, 3],
      posts: [1, 2]
    },
    {
      id: 2,
      name: 'Maria',
      email: 'maria@gmail.com',
      role: 'admin',
      score: 950,
      coursesIds: [2],
      familyIds: [1],
      challengesCompletedIds: [2],
      pendingChallengesIds: [1],
      couponsIds: [2]
    },
    // Adicione mais usuários de mock conforme necessário
  ];

  constructor() { }

  // Retorna todos os usuários
  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  // Retorna um usuário pelo ID
  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(user => user.id === id);
    return of(user);
  }

  // Adiciona um novo usuário
  addUser(user: User): Observable<User> {
    user.id = this.generateId(); // Simula a geração de um ID
    this.users.push(user);
    return of(user);
  }

  // Atualiza um usuário existente
  updateUser(updatedUser: User): Observable<User | undefined> {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      return of(updatedUser);
    }
    return of(undefined); // Retorna undefined se o usuário não for encontrado
  }

  // Deleta um usuário pelo ID
  deleteUser(id: number): Observable<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return of(this.users.length < initialLength);
  }

  // Simula a geração de um ID único
  private generateId(): number {
    if (this.users.length === 0) {
      return 1;
    }
    return Math.max(...this.users.map(user => user.id)) + 1;
  }
}