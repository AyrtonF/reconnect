import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterInstitutionStaffPageRoutingModule } from './register-institution-staff-routing.module';
import { RegisterInstitutionStaffPage } from './register-institution-staff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterInstitutionStaffPageRoutingModule,
  ],
  declarations: [RegisterInstitutionStaffPage],
})
export class RegisterInstitutionStaffPageModule {}
