import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone:false
})
export class MainPage {
  constructor(private navCtrl: NavController) {}

  login() {
    this.navCtrl.navigateForward('/login');
  }

  register() {
    this.navCtrl.navigateForward('/register');
  }
}
