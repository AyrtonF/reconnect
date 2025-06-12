import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCourseInstitutionPageRoutingModule } from './add-course-institution-routing.module';

import { AddCourseInstitutionPage } from './add-course-institution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCourseInstitutionPageRoutingModule
  ],
  declarations: [AddCourseInstitutionPage]
})
export class AddCourseInstitutionPageModule {}
