import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private showMenuSubject = new BehaviorSubject<boolean>(false);
  showMenu$ = this.showMenuSubject.asObservable();

  // Lista de rotas onde o menu não deve aparecer
  private menuExcludedRoutes = ['/login', '/register', '/main'];

  toggleMenu(show: boolean) {
    this.showMenuSubject.next(show);
  }

  shouldShowMenu(route: string): boolean {
    return !this.menuExcludedRoutes.some(excludedRoute => 
      route.startsWith(excludedRoute)
    );
  }
}