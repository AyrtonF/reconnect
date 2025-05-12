import { Component } from '@angular/core';

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

  constructor() {}

  register() {
    console.log('Cadastro:', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
    });

    // Aqui você pode adicionar chamada ao backend, validação etc.
  }
}
