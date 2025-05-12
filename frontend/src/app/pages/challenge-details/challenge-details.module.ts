import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChallengeDetailsPageRoutingModule } from './challenge-details-routing.module';

import { ChallengeDetailsPage } from './challenge-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChallengeDetailsPageRoutingModule
  ],
  declarations: [ChallengeDetailsPage]
})
export class ChallengeDetailsPageModule {}
