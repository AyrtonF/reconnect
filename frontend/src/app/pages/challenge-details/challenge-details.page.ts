import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { UserService } from '../../services/user.service';
import { Challenge, User } from '../../models/types';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.page.html',
  styleUrls: ['./challenge-details.page.scss'],
  standalone: false
})
export class ChallengeDetailsPage implements OnInit {
  challenge: Challenge | undefined;
  participants: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private userService: UserService,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.loadChallengeDetails();
  }

  loadChallengeDetails() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const challengeId = Number(params.get('id'));
        return this.challengeService.getChallengeById(challengeId);
      })
    ).subscribe(challenge => {
      this.challenge = challenge;
      this.loadParticipants();
    });
  }

  loadParticipants() {
    if (this.challenge?.participantsIds) {
      this.challenge.participantsIds.forEach(userId => {
        this.userService.getUserById(userId).subscribe(user => {
          if (user) {
            this.participants.push(user);
          }
        });
      });
    }
  }

  goChallenge() {
    this.navCtrl.navigateRoot('/challenge');
  }

  // Método para participar do desafio (mockado)
  participateChallenge() {
    if (this.challenge) {
      const loggedInUserId = 1; // Mock do usuário logado
      if (!this.challenge.participantsIds?.includes(loggedInUserId)) {
        const updatedChallenge: Challenge = {
          ...this.challenge,
          participantsIds: [...(this.challenge.participantsIds || []), loggedInUserId]
        };
        this.challengeService.updateChallenge(updatedChallenge).subscribe(() => {
          this.loadChallengeDetails(); // Recarrega os detalhes após participar
        });
      } else {
        console.log('Você já participa deste desafio.');
      }
    }
  }
}