import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { FamilyService } from '../../services/family.service';
import { AuthService } from '../../services/auth.service';
import { Challenge, User, Post, Family } from '../../models/types';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  NavController,
  ActionSheetController,
  AlertController,
  LoadingController,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-challenge-details',
  templateUrl: './challenge-details.page.html',
  styleUrls: ['./challenge-details.page.scss'],
  standalone: false,
})
export class ChallengeDetailsPage implements OnInit {
  challenge: Challenge | undefined;
  participants: User[] = [];
  currentUserId: number = 0;
  userFamily: Family | null = null;
  challengeActivityImage: string = '';
  isRegistered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private userService: UserService,
    private postService: PostService,
    private familyService: FamilyService,
    private authService: AuthService,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId() || 0;
    this.loadChallengeDetails();
    this.loadUserFamily();
  }

  loadUserFamily() {
    if (this.currentUserId) {
      this.familyService.getUserFamilies(this.currentUserId).subscribe({
        next: (families: Family[]) => {
          if (families && families.length > 0) {
            this.userFamily = families[0];
          }
        },
        error: (error: any) => {
          console.error('Erro ao carregar família:', error);
        },
      });
    }
  }

  loadChallengeDetails() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const challengeId = Number(params.get('id'));
          return this.challengeService.getChallengeById(challengeId);
        })
      )
      .subscribe((challenge) => {
        this.challenge = challenge;
        this.loadParticipants();
      });
  }

  loadParticipants() {
    if (this.challenge?.participantsIds) {
      this.challenge.participantsIds.forEach((userId) => {
        this.userService.getUserById(userId).subscribe((user) => {
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

  // Método para participar do desafio
  participateChallenge() {
    if (this.challenge) {
      const loggedInUserId = 1; // Mock do usuário logado
      this.challengeService
        .participateInChallenge(this.challenge.id, loggedInUserId)
        .subscribe(
          (success) => {
            if (success) {
              this.loadChallengeDetails(); // Recarrega os detalhes após participar
            } else {
              console.log('Não foi possível participar do desafio.');
            }
          },
          (error) => {
            console.error('Erro ao participar do desafio:', error);
          }
        );
    }
  }

  // Método para registrar atividade do desafio
  async registerActivity() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Registrar Atividade',
      buttons: [
        {
          text: 'Câmera',
          icon: 'camera',
          handler: () => {
            this.takePhoto(CameraSource.Camera);
          },
        },
        {
          text: 'Galeria',
          icon: 'images',
          handler: () => {
            this.takePhoto(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async takePhoto(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      this.challengeActivityImage = image.dataUrl || '';
      this.isRegistered = true;

      await this.showToast(
        'Foto registrada! Agora você pode concluir o desafio.',
        'success'
      );
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      await this.showToast('Erro ao capturar foto', 'danger');
    }
  }

  // Método para concluir desafio
  async completeChallenge() {
    if (!this.isRegistered || !this.challengeActivityImage) {
      await this.showAlert(
        'Atenção',
        'Você precisa registrar uma atividade antes de concluir o desafio.'
      );
      return;
    }

    if (!this.userFamily) {
      await this.showAlert(
        'Erro',
        'Você precisa fazer parte de uma família para concluir desafios.'
      );
      return;
    }

    const alert = await this.alertController.create({
      header: 'Concluir Desafio',
      message:
        'Tem certeza que deseja concluir este desafio? Um post será criado na página da família para validação.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Concluir',
          handler: async () => {
            await this.submitChallengeCompletion();
          },
        },
      ],
    });

    await alert.present();
  }

  async submitChallengeCompletion() {
    console.log(
      'ChallengeDetailsPage.submitChallengeCompletion - Iniciando submissão:',
      {
        currentUserId: this.currentUserId,
        userFamily: this.userFamily,
        challenge: this.challenge,
        challengeActivityImage: this.challengeActivityImage,
      }
    );

    const loading = await this.loadingController.create({
      message: 'Enviando conclusão do desafio...',
    });
    await loading.present();

    try {
      // Criar post na família
      const newPost: Omit<Post, 'id'> = {
        userId: this.currentUserId,
        familyId: this.userFamily!.id,
        caption: `Completei o desafio: ${
          this.challenge?.title
        }! 🎉\n\nAguardando validação da família para receber ${
          this.challenge?.score || 0
        } pontos.`,
        image: this.challengeActivityImage,
        likes: 0,
        timestamp: new Date().toISOString(),
      };

      console.log(
        'ChallengeDetailsPage.submitChallengeCompletion - Dados do post:',
        newPost
      );

      const result = await this.postService.addPost(newPost).toPromise();
      console.log(
        'ChallengeDetailsPage.submitChallengeCompletion - Post criado com sucesso:',
        result
      );

      await loading.dismiss();
      await this.showToast(
        'Desafio enviado para validação da família!',
        'success'
      );

      // Navegar para página da família
      this.navCtrl.navigateForward('/family-details');
    } catch (error) {
      await loading.dismiss();
      console.error(
        'ChallengeDetailsPage.submitChallengeCompletion - Erro ao concluir desafio:',
        {
          error,
          errorMessage:
            error instanceof Error ? error.message : 'Erro desconhecido',
          stack: error instanceof Error ? error.stack : undefined,
        }
      );
      await this.showAlert(
        'Erro',
        'Não foi possível enviar a conclusão do desafio.'
      );
    }
  }

  private async showToast(message: string, color: string = 'medium') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
