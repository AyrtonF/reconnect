import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterInstitutionAdminPageRoutingModule } from './register-institution-admin-routing.module';
import { RegisterInstitutionAdminPage } from './register-institution-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterInstitutionAdminPageRoutingModule,
  ],
  declarations: [RegisterInstitutionAdminPage],
})
export class RegisterInstitutionAdminPageModule {}
