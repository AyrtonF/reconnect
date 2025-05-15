import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCouponsPageRoutingModule } from './my-coupons-routing.module';

import { MyCouponsPage } from './my-coupons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCouponsPageRoutingModule
  ],
  declarations: [MyCouponsPage]
})
export class MyCouponsPageModule {}
