import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})
export class SideMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  menuItems = [
    {
      icon: 'home-outline',
      label: 'Início',
      route: '/home',
    },
    {
      icon: 'person-outline',
      label: 'Perfil',
      route: '/profile',
    },
    {
      icon: 'book-outline',
      label: 'Cursos',
      route: '/courses',
    },
    {
      icon: 'people-outline',
      label: 'Família',
      route: '/family-details',
    },
    {
      icon: 'walk-outline',
      label: 'Desafios',
      route: '/challenge',
    },
    {
      icon: 'storefront-outline',
      label: 'Parceiros',
      route: '/partners',
    },
    {
      icon: 'ticket-outline',
      label: 'Meus Cupons',
      route: '/my-coupons',
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  onClose() {
    this.closeMenu.emit();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/main']);
            this.onClose();
          },
        },
      ],
    });

    await alert.present();
  }
}
