import { Injectable } from '@angular/core';
import { Post } from '../models/types';

import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    { id: 1, userId: 1, familyId: 1, caption: 'Corrida no parque...', image: '../../assets/images/marcos-corrida.png', likes: 10, timestamp: '2025-05-13T08:39:00Z' },
    { id: 2, userId: 2, familyId: 1, caption: 'Pedalada em familia!', image:'../../assets/images/pedalada.png', likes: 15, timestamp: '2025-05-13T12:00:00Z' },
    { id: 3, userId: 4, familyId: 2, caption: 'Piquenique no domingo.', image: '../../assets/images/corrida.png', likes: 8, timestamp: '2025-05-18T10:00:00Z' },
    // Adicione mais posts conforme necessário
  ];

  constructor() { }

  getAllPosts(): Observable<Post[]> {
    return of(this.posts);
  }

  getPostById(id: number): Observable<Post | undefined> {
    const post = this.posts.find(p => p.id === id);
    return of(post);
  }

  addPost(post: Post): Observable<Post> {
    post.id = this.generateId();
    this.posts.push(post);
    return of(post);
  }

  updatePost(updatedPost: Post): Observable<Post | undefined> {
    const index = this.posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
      return of(updatedPost);
    }
    return of(undefined);
  }

  deletePost(id: number): Observable<boolean> {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(p => p.id !== id);
    return of(this.posts.length < initialLength);
  }

  private generateId(): number {
    if (this.posts.length === 0) {
      return 1;
    }
    return Math.max(...this.posts.map(p => p.id)) + 1;
  }
}