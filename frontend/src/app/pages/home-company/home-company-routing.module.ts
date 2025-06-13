import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCompanyPage } from './home-company.page';

const routes: Routes = [
  {
    path: '',
    component: HomeCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeCompanyPageRoutingModule {}
