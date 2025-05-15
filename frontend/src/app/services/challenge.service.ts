import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Challenge } from '../models/types'; 
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private mockChallenges: Challenge[] = [
    {
      id: 1,
      title: 'Fazer uma Caminhada',
      description: 'Caminhada de 5km com familiares e amigos.',
      status: 'completed',
      participantsIds: [1, 2, 3, 4],
      image: '../../../assets/images/pedalada.png',
      imageBanner:'../../../assets/images/pedalada-banner.png',
      checks: 4,
      score: 100,
      type: 'physical',
      familyId: 1
    },
    {
      id: 2,
      title: 'Ler um Livro',
      description: 'Ler um livro de pelo menos 100 páginas.',
      status: 'pending',
      participantsIds: [1, 2],
      image: '../../../assets/images/cinema.png',
      imageBanner:'../../../assets/images/cinemark-banner.png',
      checks: 0,
      score: 50,
      type: 'intellectual',
      familyId: 1
    },
    {
      id: 3,
      title: 'Plantar uma Árvore',
      description: 'Plantar uma árvore em um local apropriado.',
      status: 'notStarted',
      participantsIds: [3, 4],
      image: '../../../assets/images/cinema.png',
      checks: 1,
      score: 150,
      type: 'environmental',
      familyId: 2
    },
    // Adicione mais desafios mockados conforme necessário
  ];

  constructor() { }

  getAllChallenges(): Observable<Challenge[]> {
    return of(this.mockChallenges);
  }

  getChallengeById(id: number): Observable<Challenge | undefined> {
    const challenge = this.mockChallenges.find(challenge => challenge.id === id);
    return of(challenge);
  }

  addChallenge(challenge: Challenge): Observable<Challenge> {
    challenge.id = this.generateId();
    this.mockChallenges.push(challenge);
    return of(challenge);
  }

  updateChallenge(updatedChallenge: Challenge): Observable<Challenge | undefined> {
    const index = this.mockChallenges.findIndex(challenge => challenge.id === updatedChallenge.id);
    if (index !== -1) {
      this.mockChallenges[index] = updatedChallenge;
      return of(updatedChallenge);
    }
    return of(undefined);
  }

  deleteChallenge(id: number): Observable<boolean> {
    const initialLength = this.mockChallenges.length;
    this.mockChallenges = this.mockChallenges.filter(challenge => challenge.id !== id);
    return of(this.mockChallenges.length < initialLength);
  }

  private generateId(): number {
    if (this.mockChallenges.length === 0) {
      return 1;
    }
    return Math.max(...this.mockChallenges.map(challenge => challenge.id)) + 1;
  }
}