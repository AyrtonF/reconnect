import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/types';
import { NavController } from '@ionic/angular';
import { navigate } from 'src/app/functions/navigate';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  username = '';
  points = 0;
  progress = 0;
  pointsAwarded = 100;
  userId: number | null = null;

  constructor(private userService: UserService, private navCtrl: NavController) {}

  ngOnInit(): void {

    this.userId = 1;

    if (this.userId !== null) {
      this.loadUserData(this.userId);
    }
  }

  loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        if (user) {
          this.username = user.name || 'Usuário';
          this.points = user.score || 0;

          this.progress = Math.min(100, (this.points / 1000) * 100);
        } else {
          console.error('Usuário não encontrado com o ID:', userId);

        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados do usuário:', error);

      }
    });
  }

   navigateToPage(pageName: string) {
    navigate(this.navCtrl, pageName); // Passe a instância do NavController
  }
}
