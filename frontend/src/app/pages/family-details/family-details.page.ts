import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, switchMap, of, catchError } from 'rxjs';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { FamilyService } from '../../services/family.service';
import { AuthService } from '../../services/auth.service';
import { Post, User, Family } from '../../models/types';
import {
  AlertController,
  ToastController,
  LoadingController,
  NavController,
} from '@ionic/angular';

interface PostViewModel {
  id: number;
  userId: number;
  name: string;
  time: string;
  caption: string;
  image: string;
  avatar: string;
  likes: number;
  isChallengePost: boolean;
  isValidated: boolean;
  canValidate: boolean;
}

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.page.html',
  styleUrls: ['./family-details.page.scss'],
  standalone: false,
})
export class FamilyDetailsPage implements OnInit {
  posts: PostViewModel[] = [];
  familyId: number = 1;
  isLoading: boolean = false;
  currentUserId: number = 0;
  userFamily: Family | null = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private familyService: FamilyService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId() || 0;
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.familyId = +params['id'];
        this.loadFamilyPosts();
      } else {
        this.loadUserFamilyAndPosts();
      }
    });
  }

  private loadUserFamilyAndPosts() {
    if (this.currentUserId) {
      this.familyService.getUserFamilies(this.currentUserId).subscribe({
        next: (families: Family[]) => {
          if (families && families.length > 0) {
            this.userFamily = families[0];
            this.familyId = this.userFamily.id;
            this.loadFamilyPosts();
          } else {
            console.log('User is not part of any family');
          }
        },
        error: (error: any) => {
          console.error('Error loading user family:', error);
        },
      });
    }
  }

  private loadFamilyPosts() {
    this.isLoading = true;
    console.log('Loading posts for family:', this.familyId);

    // Usar o método direto do PostService para buscar posts por família
    this.postService.getPostsByFamily(this.familyId).subscribe({
      next: (posts) => {
        console.log('Posts loaded for family:', posts);
        if (posts && posts.length > 0) {
          const postObservables = posts.map((post) =>
            this.userService.getUserById(post.userId).pipe(
              map((user) => {
                console.log('User loaded for post:', user);
                return this.createPostViewModel(post, user);
              }),
              catchError((error) => {
                console.error('Error loading user for post:', error);
                return of(null);
              })
            )
          );

          forkJoin(postObservables).subscribe({
            next: (results) => {
              console.log('All posts processed:', results);
              this.posts = results.filter(
                (post): post is PostViewModel => post !== null
              );
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading posts:', error);
              this.posts = [];
              this.isLoading = false;
            },
          });
        } else {
          console.log('No posts found for family');
          this.posts = [];
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading family:', error);
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  private createPostViewModel(
    post: Post,
    user?: User | undefined
  ): PostViewModel {
    const isChallengePost =
      post.caption?.includes('Completei o desafio:') || false;
    const isValidated = post.likes && post.likes > 0 ? true : false;
    const canValidate =
      isChallengePost && !isValidated && post.userId !== this.currentUserId;

    const viewModel: PostViewModel = {
      id: post.id,
      userId: post.userId,
      name: user?.name || 'Usuário Desconhecido',
      time: this.formatTimestamp(post.timestamp),
      caption: post.caption || '',
      image: post.image || '',
      avatar: user?.avatar || '../../../assets/images/default-user.png',
      likes: post.likes || 0,
      isChallengePost,
      isValidated,
      canValidate,
    };

    return viewModel;
  }

  private formatTimestamp(timestamp?: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date
      .toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
  }

  async validateChallengePost(post: PostViewModel) {
    const alert = await this.alertController.create({
      header: 'Validar Desafio',
      message: `Deseja validar o desafio completado por ${post.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Validar',
          handler: async () => {
            await this.confirmValidation(post);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmValidation(post: PostViewModel) {
    const loading = await this.loadingController.create({
      message: 'Validando desafio...',
    });
    await loading.present();

    try {
      // Atualizar post com like para marcar como validado
      const updatedPost: Post = {
        id: post.id,
        userId: post.userId,
        familyId: this.familyId,
        caption: post.caption,
        image: post.image,
        likes: (post.likes || 0) + 1,
        timestamp: post.time,
      };

      await this.postService.updatePost(post.id, updatedPost).toPromise();

      // Adicionar pontos ao usuário por completar o desafio
      const challengePoints = 10; // Pontos fixos por desafio validado
      try {
        await this.userService
          .addPointsToUser(post.userId, challengePoints)
          .toPromise();
        console.log(
          `Adicionados ${challengePoints} pontos ao usuário ${post.userId}`
        );
      } catch (pointsError) {
        console.error('Erro ao adicionar pontos:', pointsError);
        // Não falha o processo se não conseguir adicionar pontos
      }

      await loading.dismiss();
      await this.showToast(
        'Desafio validado com sucesso! Pontos adicionados ao usuário.',
        'success'
      );

      // Recarregar posts
      this.loadFamilyPosts();
    } catch (error) {
      await loading.dismiss();
      console.error('Erro ao validar desafio:', error);
      await this.showAlert('Erro', 'Não foi possível validar o desafio.');
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
