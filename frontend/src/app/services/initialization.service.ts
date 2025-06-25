import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InitializationService {
  constructor(private authService: AuthService, private router: Router) {}

  async initialize(): Promise<void> {
    try {
      // Verifica se o usuário está logado
      if (this.authService.isLoggedIn()) {
        // Verifica se o token ainda é válido fazendo uma chamada ao backend
        await this.authService.getCurrentUser().toPromise();

        // Se chegou até aqui, o token é válido
        // Redireciona para a página apropriada baseada no role
        const userRole = this.authService.getUserRole();
        if (userRole) {
          const redirectRoute = this.authService.getRedirectRoute(userRole);
          this.router.navigate([redirectRoute]);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        // Não está logado, vai para a página principal
        this.router.navigate(['/main']);
      }
    } catch (error) {
      // Token inválido ou erro de conexão
      console.error('Erro ao verificar autenticação:', error);
      this.authService.logout();
      this.router.navigate(['/main']);
    }
  }
}
