import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService, 
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    // Validação básica
    if (!this.email || !this.password) {
      await this.showAlert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Fazendo login...',
      spinner: 'circular'
    });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        console.log('Login bem-sucedido:', response);
        
        // Usar os métodos do serviço para salvar os dados
        this.authService.saveToken(response.token);
        this.authService.saveUserRole(response.role);
        
        // Redirecionar baseado no role usando o método do serviço
        const redirectRoute = this.authService.getRedirectRoute(response.role);
        this.navCtrl.navigateRoot(redirectRoute);
      },
      error: async (error) => {
        await loading.dismiss();
        console.error('Erro no login:', error);
        await this.showAlert('Erro de Login', error.message);
      }
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToSignUp() {
    this.navCtrl.navigateForward('/register');
  }



  goBack() {
    this.navCtrl.back();
  }
}