import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCouponsPage } from './my-coupons.page';

const routes: Routes = [
  {
    path: '',
    component: MyCouponsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCouponsPageRoutingModule {}
