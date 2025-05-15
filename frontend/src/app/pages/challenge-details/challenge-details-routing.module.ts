import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChallengeDetailsPage } from './challenge-details.page';

const routes: Routes = [
  {
    path: '', // Este é o caminho padrão para o módulo challenge-details
    component: ChallengeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChallengeDetailsPageRoutingModule {}