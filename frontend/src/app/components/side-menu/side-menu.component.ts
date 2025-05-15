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
      route: '/perfil'
    },
    {
      icon: 'ticket',
      label: 'Meus Cupons',
      route: '/meus-cupons'
    },
    {
      icon: 'settings',
      label: 'Configurações',
      route: '/configuracoes'
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