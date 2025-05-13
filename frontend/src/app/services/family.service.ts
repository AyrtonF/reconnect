import { Injectable } from '@angular/core';
import { Family } from '../models/types';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private families: Family[] = [
    { id: 1, name: 'Familia Feliz', membersIds: [1, 2, 3], postsIds: [1, 2], challengesIds: [1, 2] },
    { id: 2, name: 'Os Silvas', membersIds: [4, 5], postsIds: [3], challengesIds: [3] },
    // Adicione mais famílias conforme necessário
  ];

  constructor() { }

  getAllFamilies(): Observable<Family[]> {
    return of(this.families);
  }

  getFamilyById(id: number): Observable<Family | undefined> {
    const family = this.families.find(f => f.id === id);
    return of(family);
  }

  addFamily(family: Family): Observable<Family> {
    family.id = this.generateId();
    this.families.push(family);
    return of(family);
  }

  updateFamily(updatedFamily: Family): Observable<Family | undefined> {
    const index = this.families.findIndex(f => f.id === updatedFamily.id);
    if (index !== -1) {
      this.families[index] = updatedFamily;
      return of(updatedFamily);
    }
    return of(undefined);
  }

  deleteFamily(id: number): Observable<boolean> {
    const initialLength = this.families.length;
    this.families = this.families.filter(f => f.id !== id);
    return of(this.families.length < initialLength);
  }

  private generateId(): number {
    if (this.families.length === 0) {
      return 1;
    }
    return Math.max(...this.families.map(f => f.id)) + 1;
  }
}