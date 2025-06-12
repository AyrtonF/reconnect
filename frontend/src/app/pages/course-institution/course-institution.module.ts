import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseInstitutionPageRoutingModule } from './course-institution-routing.module';

import { CourseInstitutionPage } from './course-institution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseInstitutionPageRoutingModule
  ],
  declarations: [CourseInstitutionPage]
})
export class CourseInstitutionPageModule {}
