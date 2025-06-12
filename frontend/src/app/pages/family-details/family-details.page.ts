import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { FamilyService } from '../../services/family.service';
import { Post, User, Family } from '../../models/types';

interface PostViewModel {
  name: string;
  time: string;
  caption: string;
  image: string;
  avatar: string;
  likes: number;
}

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.page.html',
  styleUrls: ['./family-details.page.scss'],
  standalone: false
})
export class FamilyDetailsPage implements OnInit {
  posts: PostViewModel[] = [];
  familyId: number = 1;
  isLoading: boolean = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private familyService: FamilyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Adicionando log para debug
    console.log('ngOnInit called');
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['id']) {
        this.familyId = +params['id'];
        this.loadFamilyPosts();
      } else {
        // Se não houver ID na rota, carrega a família padrão
        this.loadFamilyPosts();
      }
    });
  }

  private loadFamilyPosts() {
    this.isLoading = true;
    console.log('Loading posts for family:', this.familyId);
    
    this.familyService.getFamilyById(this.familyId).subscribe({
      next: (family) => {
        console.log('Family loaded:', family);
        if (family && family.postsIds && family.postsIds.length > 0) {
          const postObservables = family.postsIds.map(postId => 
            this.postService.getPostById(postId).pipe(
              switchMap(post => {
                console.log('Post loaded:', post);
                if (!post) {
                  return of(null);
                }
                return this.userService.getUserById(post.userId).pipe(
                  map(user => {
                    console.log('User loaded:', user);
                    return this.createPostViewModel(post, user);
                  })
                );
              })
            )
          );

          forkJoin(postObservables).subscribe({
            next: (results) => {
              console.log('All posts loaded:', results);
              this.posts = results.filter((post): post is PostViewModel => post !== null);
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading posts:', error);
              this.posts = [];
              this.isLoading = false;
            }
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
      }
    });
  }

  private createPostViewModel(post: Post, user?: User | undefined): PostViewModel {
    const viewModel = {
      name: user?.name || 'Usuário Desconhecido',
      time: this.formatTimestamp(post.timestamp),
      caption: post.caption || '',
      image: post.image || '',
      avatar: user?.avatar || '../../../assets/images/default-user.png',
      likes: post.likes || 0
    };
    console.log('Created view model:', viewModel);
    return viewModel;
  }

  private formatTimestamp(timestamp?: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  }
}