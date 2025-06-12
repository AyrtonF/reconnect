import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseInstitutionPage } from './course-institution.page';

const routes: Routes = [
  {
    path: '',
    component: CourseInstitutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseInstitutionPageRoutingModule {}
