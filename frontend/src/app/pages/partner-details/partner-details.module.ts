import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnerDetailsPageRoutingModule } from './partner-details-routing.module';

import { PartnerDetailsPage } from './partner-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerDetailsPageRoutingModule
  ],
  declarations: [PartnerDetailsPage]
})
export class PartnerDetailsPageModule {}
