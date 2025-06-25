import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './side-menu.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([]) // Use forChild se este for um módulo lazy-loaded
  ],
  declarations: [SideMenuComponent],
  exports: [SideMenuComponent]
})
export class SideMenuComponentModule {}