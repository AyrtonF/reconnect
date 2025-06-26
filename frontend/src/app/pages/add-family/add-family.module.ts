import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFamilyPageRoutingModule } from './add-family-routing.module';

import { AddFamilyPage } from './add-family.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFamilyPageRoutingModule
  ],
  declarations: [AddFamilyPage]
})
export class AddFamilyPageModule {}
