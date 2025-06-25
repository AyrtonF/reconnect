import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
  providers: [provideNgxMask()]
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

   phoneNumberMask = '(00) 00000-0000';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private toastController: ToastController,
    private router: Router
  ) {}

togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async register() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      // Primeiro registra o usuário através do AuthService
      const authResponse = await this.authService.register(
        this.name,
        this.email,
        this.password
      ).toPromise();

      if (authResponse) {
        // Cria um usuário mais completo com o UserService
        const newUser = {
          id: 0, 
          name: this.name,
          email: this.email,
          password: this.password,
          role: 'user',
          phone: this.phone,
          score: 0,
          coursesIds: [],
          familyIds: [],
          challengesCompletedIds: [],
          pendingChallengesIds: [],
          couponsIds: []
        };

        await this.userService.addUser(newUser).toPromise();

        await this.presentToast('Cadastro realizado com sucesso!', 'success');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      await this.presentToast(
        error.message || 'Erro ao realizar cadastro',
        'danger'
      );
    } finally {
      this.isLoading = false;
    }
  }


private validateForm(): boolean {
    if (!this.name || !this.email || !this.password || !this.phone) {
      this.presentToast('Por favor, preencha todos os campos', 'warning');
      return false;
    }

    if (!this.validateEmail(this.email)) {
      this.presentToast('Por favor, insira um email válido', 'warning');
      return false;
    }


    if (this.password.length < 6) {
      this.presentToast('A senha deve ter pelo menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}