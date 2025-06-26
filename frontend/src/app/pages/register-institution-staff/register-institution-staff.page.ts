import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-institution-staff',
  templateUrl: './register-institution-staff.page.html',
  styleUrls: ['./register-institution-staff.page.scss'],
  standalone: false,
})
export class RegisterInstitutionStaffPage {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  companyName: string = '';
  department: string = '';
  position: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  phoneNumberMask = '(00) 00000-0000';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Criando conta de funcionário...',
      spinner: 'circular',
    });
    await loading.present();

    try {
      const authResponse = await this.authService
        .register(this.name, this.email, this.password, 'INSTITUTION_STAFF')
        .toPromise();

      if (authResponse) {
        await loading.dismiss();
        await this.presentToast(
          'Cadastro de funcionário realizado com sucesso!',
          'success'
        );

        // Salva os dados de autenticação
        this.authService.saveToken(authResponse.token);
        this.authService.saveUserRole(authResponse.role);

        // Redireciona para home-company (staff da empresa)
        this.router.navigate(['/home-company']);
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.presentToast(
        error.message || 'Erro ao realizar cadastro',
        'danger'
      );
    }
  }

  private validateForm(): boolean {
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.phone ||
      !this.companyName ||
      !this.position
    ) {
      this.presentToast(
        'Por favor, preencha todos os campos obrigatórios',
        'warning'
      );
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

    if (this.password !== this.confirmPassword) {
      this.presentToast('As senhas não coincidem', 'warning');
      return false;
    }

    return true;
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
