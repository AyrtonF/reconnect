import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        let errorMessage = 'Ocorreu um erro inesperado';

        if (error.status === 401) {
          // Token expirado ou inválido
          errorMessage = 'Sessão expirada. Faça login novamente.';
          this.authService.logout();
          this.router.navigate(['/main']);
        } else if (error.status === 403) {
          errorMessage = 'Acesso negado.';
        } else if (error.status === 404) {
          errorMessage = 'Recurso não encontrado.';
        } else if (error.status === 500) {
          errorMessage =
            'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (error.status === 0) {
          errorMessage =
            'Erro de conexão. Verifique sua internet e se o servidor está rodando.';
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        // Exibe toast de erro apenas para erros críticos
        if (error.status === 0 || error.status >= 500) {
          this.showErrorToast(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
}
