import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserTypeSelectionPageRoutingModule } from './user-type-selection-routing.module';
import { UserTypeSelectionPage } from './user-type-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTypeSelectionPageRoutingModule,
  ],
  declarations: [UserTypeSelectionPage],
})
export class UserTypeSelectionPageModule {}
