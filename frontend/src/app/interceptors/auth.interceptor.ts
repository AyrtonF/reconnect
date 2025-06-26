import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Lista de URLs que NÃO devem receber o token de autorização
    const externalUrls = ['cloudinary.com', 'api.cloudinary.com'];

    // Verifica se a URL é externa e não deve receber token
    const shouldSkipAuth = externalUrls.some((url) =>
      request.url.includes(url)
    );

    if (!shouldSkipAuth) {
      const token = this.authService.getToken();

      if (token) {
        // O AuthService já retorna o token com "Bearer " prefixo
        request = request.clone({
          setHeaders: {
            Authorization: token,
          },
        });
      }
    }

    return next.handle(request);
  }
}
