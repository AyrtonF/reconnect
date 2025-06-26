import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserTypeSelectionPage } from './user-type-selection.page';

const routes: Routes = [
  {
    path: '',
    component: UserTypeSelectionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTypeSelectionPageRoutingModule {}
