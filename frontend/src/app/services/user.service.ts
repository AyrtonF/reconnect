import { Injectable } from '@angular/core';
import { User } from '../models/types';
import { Observable, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: (User | InstitutionalUser)[] = [
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
    // Usuários institucionais
    {
      id: 3,
      name: 'João Silva',
      email: 'joao.silva@mentestudy.com',
      password: '123456',
      role: 'institution_admin',
      userType: 'institutional',
      institutionId: 1,
      avatar: 'assets/images/avatars/joao.jpg',
      phone: '(81) 99999-1234',
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: true,
        canManageUsers: true,
        canViewReports: true
      }
    },
    {
      id: 4,
      name: 'Maria Santos',
      email: 'maria.santos@mentestudy.com',
      password: '123456',
      role: 'institution_teacher',
      userType: 'institutional',
      institutionId: 1,
      avatar: 'assets/images/avatars/maria.jpg',
      phone: '(81) 99999-5678',
      permissions: {
        canCreateCourses: true,
        canEditCourses: true,
        canDeleteCourses: false,
        canManageUsers: false,
        canViewReports: true
      }
    }
  ];

  constructor() { }

  getAllUsers(): Observable<(User | InstitutionalUser)[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | InstitutionalUser | undefined> {
    const user = this.users.find(user => user.id === id);
    return of(user);
  }

  getInstitutionalUsers(): Observable<InstitutionalUser[]> {
    return of(this.users.filter(user => 
      'userType' in user && user.userType === 'institutional'
    ) as InstitutionalUser[]);
  }

  addUser(user: User | InstitutionalUser): Observable<User | InstitutionalUser> {
    user.id = this.generateId();
    this.users.push(user);
    return of(user);
  }

  updateUser(updatedUser: User | InstitutionalUser): Observable<User | InstitutionalUser | undefined> {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      return of(updatedUser);
    }
    return of(undefined);
  }

  deleteUser(id: number): Observable<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return of(this.users.length < initialLength);
  }

  private generateId(): number {
    return Math.max(...this.users.map(user => user.id)) + 1;
  }
}