import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrEditTransactionPage } from './add-or-edit-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrEditTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrEditTransactionPageRoutingModule {}
