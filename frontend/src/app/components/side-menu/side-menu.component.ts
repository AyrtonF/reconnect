import { Component, EventEmitter, Output } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone:false
})
export class SideMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  menuItems = [
    {
      icon: 'person',
      label: 'Perfil',
      route: '/profile'
    },
    {
      icon: 'ticket',
      label: 'Meus Cupons',
      route: '/my-coupons'
    },
    {
      icon: 'settings',
      label: 'Configurações',
      route: '/settings'
    }
  ];

  onClose() {
    this.closeMenu.emit();
  }

  logout() {
    // Implementar lógica de logout
    console.log('Logout realizado');
  }
}