import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';
import { UserService } from '../../services/user.service';
import { Challenge } from '../../models/types';
import { User } from '../../models/types';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.page.html',
  styleUrls: ['./challenge.page.scss'],
  standalone: false,
})
export class ChallengePage implements OnInit {
  userPoints: number = 0;
  challenges: Challenge[] = [];
  dailyChallenges: Challenge[] = [];
  ongoingChallenges: Challenge[] = [];
  completedChallenges: Challenge[] = [];
  loggedInUserId: number = 0;
  loadingChallenges = true;
  selectedTodayChallenge: Challenge | null = null;

  constructor(
    private challengeService: ChallengeService,
    private userService: UserService,
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getUserId() || 0;
    this.loadUserPoints();
    this.loadChallenges();
  }

  loadChallenges() {
    this.loadingChallenges = true;
    this.challengeService.getAllChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.organizeChallenges();
        this.loadingChallenges = false;
      },
      error: (error) => {
        console.error('Erro ao carregar desafios:', error);
        this.loadingChallenges = false;
      },
    });
  }

  organizeChallenges() {
    // Separar desafios em categorias
    this.ongoingChallenges = this.challenges.filter((challenge) =>
      this.isChallengeInProgress(challenge)
    );

    this.completedChallenges = this.challenges.filter((challenge) =>
      this.isChallengeCompleted(challenge)
    );

    // Selecionar 3 desafios aleatórios para o dia (que não estão em andamento ou completos)
    const availableChallenges = this.challenges.filter(
      (challenge) =>
        !this.isChallengeInProgress(challenge) &&
        !this.isChallengeCompleted(challenge)
    );

    this.dailyChallenges = this.getRandomChallenges(availableChallenges, 3);
  }

  getRandomChallenges(challenges: Challenge[], count: number): Challenge[] {
    const shuffled = [...challenges].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  loadUserPoints() {
    if (this.loggedInUserId) {
      // Usar o método do AuthService que tem melhor tratamento de erro
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.userPoints = user?.score || 0;
        },
        error: (error) => {
          console.error('Erro ao carregar pontos do usuário:', error);
          // Fallback para um valor padrão
          this.userPoints = 0;
        },
      });
    }
  }

  // Verificações de status dos desafios
  isChallengeCompleted(challenge: Challenge): boolean {
    // Verificar se o usuário já completou este desafio
    return !!(
      challenge.participantsIds?.includes(this.loggedInUserId) &&
      challenge.status === 'completed'
    );
  }

  isChallengeInProgress(challenge: Challenge): boolean {
    // Verificar se o usuário está participando do desafio
    return !!(
      challenge.participantsIds?.includes(this.loggedInUserId) &&
      challenge.status !== 'completed'
    );
  }

  isChallengeDisabled(challenge: Challenge): boolean {
    // Desabilitar se já foi selecionado outro desafio hoje
    if (
      this.selectedTodayChallenge &&
      this.selectedTodayChallenge.id !== challenge.id
    ) {
      return true;
    }
    return this.isChallengeCompleted(challenge);
  }

  // Métodos para definir aparência dos cards
  getChallengeStatusClass(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'status-completed';
    if (this.isChallengeInProgress(challenge)) return 'status-in-progress';
    return 'status-available';
  }

  getChallengeStatusIcon(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'checkmark-circle';
    if (this.isChallengeInProgress(challenge)) return 'time';
    return 'star-outline';
  }

  getChallengeButtonFill(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'outline';
    if (this.isChallengeInProgress(challenge)) return 'outline';
    return 'solid';
  }

  getChallengeButtonColor(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'success';
    if (this.isChallengeInProgress(challenge)) return 'warning';
    return 'primary';
  }

  getChallengeButtonIcon(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'checkmark-outline';
    if (this.isChallengeInProgress(challenge)) return 'eye-outline';
    return 'play-outline';
  }

  getChallengeButtonText(challenge: Challenge): string {
    if (this.isChallengeCompleted(challenge)) return 'Concluído';
    if (this.isChallengeInProgress(challenge)) return 'Ver mais';
    return 'Participar';
  }

  // Ações dos desafios
  handleChallengeClick(challenge: Challenge) {
    this.goToChallengeDetails(challenge.id);
  }

  handleChallengeAction(challenge: Challenge, event: Event) {
    event.stopPropagation();

    if (this.isChallengeCompleted(challenge)) {
      this.goToChallengeDetails(challenge.id);
    } else if (this.isChallengeInProgress(challenge)) {
      this.goToChallengeDetails(challenge.id);
    } else {
      this.participateChallenge(challenge.id);
    }
  }

  participateChallenge(challengeId: number) {
    this.challengeService
      .participateInChallenge(challengeId, this.loggedInUserId)
      .subscribe({
        next: (success) => {
          if (success) {
            // Marcar como desafio selecionado do dia
            this.selectedTodayChallenge =
              this.dailyChallenges.find((c) => c.id === challengeId) || null;
            this.loadChallenges(); // Recarregar para atualizar status
            this.goToChallengeDetails(challengeId);
          }
        },
        error: (error) => {
          console.error('Erro ao participar do desafio:', error);
        },
      });
  }

  goToChallengeDetails(challengeId: number) {
    this.navCtrl.navigateForward(`/challenge-details/${challengeId}`);
  }

  goChallengeDetails(challengeId: number) {
    this.goToChallengeDetails(challengeId);
  }

  seeMoreChallenge(challengeId: number) {
    this.goToChallengeDetails(challengeId);
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  // Métodos legacy para compatibilidade
  getButtonText(challenge: Challenge): string {
    return this.getChallengeButtonText(challenge);
  }

  getChallengeStatus(challenge: Challenge): string {
    return this.getChallengeStatusClass(challenge);
  }

  getChallengeImage(challenge: Challenge): string {
    return challenge.image || 'assets/images/default-course.png'; // Usar imagem existente como fallback
  }
}
