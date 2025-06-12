import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCourseInstitutionPage } from './add-course-institution.page';

const routes: Routes = [
  {
    path: '',
    component: AddCourseInstitutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCourseInstitutionPageRoutingModule {}
