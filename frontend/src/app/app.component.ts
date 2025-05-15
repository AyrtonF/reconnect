import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { MenuService } from './services/menu.service';
import { filter } from 'rxjs/operators'; // Adicione esta importação

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showMenu = false;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private menuService: MenuService
  ) {
    this.setupMenuVisibility();
  }

  private setupMenuVisibility() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const shouldShow = this.menuService.shouldShowMenu(event.url);
      this.showMenu = shouldShow;
      if (!shouldShow) {
        this.menuController.enable(false);
      } else {
        this.menuController.enable(true);
      }
    });
  }

  closeMenu() {
    this.menuController.close();
  }
}