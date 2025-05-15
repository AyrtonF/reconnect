import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(private navCtrl:NavController) {}

  register() {
    console.log('Cadastro:', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
    });

    // Aqui você pode adicionar chamada ao backend, validação etc.
  }
   goBack() {
    this.navCtrl.back();
  }
}
