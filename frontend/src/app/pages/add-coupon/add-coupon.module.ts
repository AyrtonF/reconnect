import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AddCouponPage } from './add-coupon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AddCouponPage
      }
    ])
  ],
  declarations: [AddCouponPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddCouponPageModule {}