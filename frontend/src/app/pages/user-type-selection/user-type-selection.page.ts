import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-type-selection',
  templateUrl: './user-type-selection.page.html',
  styleUrls: ['./user-type-selection.page.scss'],
  standalone: false,
})
export class UserTypeSelectionPage {
  constructor(private navCtrl: NavController) {}

  selectUserType(userType: 'USER' | 'INSTITUTION_ADMIN' | 'INSTITUTION_STAFF') {
    switch (userType) {
      case 'USER':
        this.navCtrl.navigateForward('/register-user');
        break;
      case 'INSTITUTION_ADMIN':
        this.navCtrl.navigateForward('/register-institution-admin');
        break;
      case 'INSTITUTION_STAFF':
        this.navCtrl.navigateForward('/register-institution-staff');
        break;
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
