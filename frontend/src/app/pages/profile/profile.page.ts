import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from '../../models/types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: User | undefined;
  isEditing = {
    email: false,
    phone: false,
    password: false,
  };
  editValues = {
    email: '',
    phone: '',
    password: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.editValues = {
            email: user.email,
            phone: user.phone || '',
            password: '',
          };
        }
      },
      error: async (error) => {
        console.error('Erro ao carregar perfil:', error);
        const toast = await this.toastController.create({
          message: 'Erro ao carregar dados do perfil',
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        toast.present();
      },
    });
  }

  toggleEdit(field: 'email' | 'phone' | 'password') {
    this.isEditing[field] = !this.isEditing[field];
    if (!this.isEditing[field] && this.user) {
      this.editValues[field] =
        field === 'password'
          ? this.user.password || ''
          : this.user[field] || '';
    }
  }

  async saveField(field: 'email' | 'phone' | 'password') {
    if (!this.user) return;

    const updatedUser: User = {
      ...this.user,
      [field]: this.editValues[field],
    };

    this.userService.updateUser(updatedUser).subscribe(async (result) => {
      if (result) {
        this.user = result;
        this.isEditing[field] = false;
        const toast = await this.toastController.create({
          message: 'Atualizado com sucesso!',
          duration: 2000,
          color: 'success',
          position: 'top',
        });
        toast.present();
      }
    });
  }

  async changeProfileImage() {
    const alert = await this.alertController.create({
      header: 'Alterar foto de perfil',
      message: 'Escolha uma opção:',
      buttons: [
        {
          text: 'Câmera',
          handler: () => {
            // Implementar lógica da câmera
          },
        },
        {
          text: 'Galeria',
          handler: () => {
            // Implementar lógica da galeria
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}
