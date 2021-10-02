import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrEditPayerPage } from './add-or-edit-payer.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrEditPayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrEditPayerPageRoutingModule {}
