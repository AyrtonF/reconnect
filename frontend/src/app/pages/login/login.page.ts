import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;

  constructor(private navCtrl: NavController) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // lógica de autenticação
    console.log('Email:', this.email);
    console.log('Senha:', this.password);
  }

  goToSignUp() {
    this.navCtrl.navigateForward('/cadastro');
  }

  forgotPassword() {
    this.navCtrl.navigateForward('/recuperar-senha');
  }

  goBack() {
    this.navCtrl.back();
  }
}
