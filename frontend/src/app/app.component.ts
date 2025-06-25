import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { MenuService } from './services/menu.service';
import { InitializationService } from './services/initialization.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  showMenu = false;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private menuService: MenuService,
    private platform: Platform,
    private initializationService: InitializationService
  ) {
    this.setupMenuVisibility();
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.initializationService.initialize();
  }

  private setupMenuVisibility() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
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
