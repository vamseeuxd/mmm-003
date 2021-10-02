import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePayersPage } from './manage-payers.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePayersPageRoutingModule {}
