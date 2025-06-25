import { Injectable } from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { APP_CONFIG } from '../config/app.config';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  /**
   * Exibe um toast com a mensagem especificada
   */
  async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' = 'primary',
    duration?: number
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration || APP_CONFIG.TIMEOUTS.TOAST_DURATION,
      color: color,
      position: 'top',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
    return toast;
  }

  /**
   * Exibe um loading com a mensagem especificada
   */
  async showLoading(message: string = 'Carregando...') {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'circular',
    });

    await loading.present();
    return loading;
  }

  /**
   * Esconde todos os loadings ativos
   */
  async hideLoading() {
    await this.loadingController.dismiss();
  }

  /**
   * Exibe um alerta com título e mensagem
   */
  async showAlert(header: string, message: string, buttons: string[] = ['OK']) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
    });

    await alert.present();
    return alert;
  }

  /**
   * Exibe um alerta de confirmação
   */
  async showConfirmAlert(
    header: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: confirmText,
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

  /**
   * Valida se um email é válido
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Formata uma data para exibição
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  /**
   * Formata uma data e hora para exibição
   */
  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR');
  }

  /**
   * Calcula o tempo relativo (ex: "há 2 horas")
   */
  getRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'agora';
    } else if (diffMinutes < 60) {
      return `há ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    }
  }

  /**
   * Debounce para evitar múltiplas chamadas rápidas
   */
  debounce(func: Function, wait: number): Function {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Gera um ID único simples
   */
  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Capitaliza a primeira letra de uma string
   */
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Trunca um texto se ele for muito longo
   */
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  }
}
