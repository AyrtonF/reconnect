import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';
import { UserService } from '../../services/user.service';
import { Challenge } from '../../models/types';
import { User } from '../../models/types';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
  standalone: false
})
export class ChallengePage implements OnInit {
  userPoints: number = 0;
  challenges: Challenge[] = [];
  loggedInUserId: number = 1; // Mock do ID do usuário logado

  constructor(
    private challengeService: ChallengeService,
    private userService: UserService,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
    this.loadUserPoints();
  }

  loadChallenges() {
    this.challengeService.getAllChallenges().subscribe(challenges => {
      this.challenges = challenges.map(challenge => ({
        ...challenge,
        buttonText: this.getButtonText(challenge),
        status: this.getChallengeStatus(challenge)
      }));
    });
  }

  loadUserPoints() {
    this.userService.getUserById(this.loggedInUserId).subscribe(user => {
      this.userPoints = user?.score || 0;
    });
  }

  getButtonText(challenge: Challenge): string {
    // Lógica para determinar o texto do botão com base no status e participação
    if (challenge.participantsIds?.includes(this.loggedInUserId)) {
      return 'Concluído'; // Ou 'Ver Detalhes', dependendo da sua lógica
    } else if (challenge.status === 'pending') {
      return 'Participar';
    } else if (challenge.status === 'completed') {
      return 'Ver Detalhes';
    } else {
      return 'Ver Mais';
    }
  }

  getChallengeStatus(challenge: Challenge): string {
    // Lógica para determinar o status visual do desafio
    if (challenge.participantsIds?.includes(this.loggedInUserId)) {
      return 'completed';
    } else if (challenge.status === 'pending') {
      return 'participate';
    } else {
      return 'see-more';
    }
  }

  participateChallenge(challengeId: number) {
    // Lógica para adicionar o usuário à lista de participantes do desafio
    this.challengeService.getChallengeById(challengeId).subscribe(challenge => {
      if (challenge && !challenge.participantsIds?.includes(this.loggedInUserId)) {
        const updatedChallenge: Challenge = {
          ...challenge,
          participantsIds: [...(challenge.participantsIds || []), this.loggedInUserId]
        };
        this.challengeService.updateChallenge(updatedChallenge).subscribe(() => {
          this.loadChallenges(); // Recarrega a lista de desafios após participar
        });
      }
    });
  }

  seeMoreChallenge(challengeId: number) {
    // Lógica para navegar para a página de detalhes do desafio
    console.log(`Ver mais detalhes do desafio ${challengeId}`);
    // Você pode usar o NavController aqui para navegar
  }

   goHome() {
    this.navCtrl.navigateRoot('/home');
  }
  goChallengeDetails(challengeId: number) {
    // Lógica para navegar para a página de detalhes do desafio
    this.navCtrl.navigateForward(`/challenge-details/${challengeId}`);
  }

  getChallengeImage(challenge: Challenge): string {
    // Lógica para obter a imagem do desafio
    return challenge.image || '../../../assets/images/default-challenge.png'; // Imagem padrão
  }
}