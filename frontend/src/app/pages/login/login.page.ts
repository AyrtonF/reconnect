import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // Importe o AuthService
import { AlertController } from '@ionic/angular'; // Importe o AlertController

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
    private alertController: AlertController 
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);
        this.navCtrl.navigateRoot('/home'); 
      },
      error: async (error) => {
        console.error('Erro no login:', error);
        const alert = await this.alertController.create({
          header: 'Erro de Login',
          message: error.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goToSignUp() {
    this.navCtrl.navigateForward('/register');
  }

  forgotPassword() {
    this.navCtrl.navigateForward('/recuperar-senha');
  }

  goBack() {
    this.navCtrl.back();
  }
}