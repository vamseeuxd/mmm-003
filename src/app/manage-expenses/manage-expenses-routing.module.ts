import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageExpensesPage } from './manage-expenses.page';

const routes: Routes = [
  {
    path: '',
    component: ManageExpensesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageExpensesRoutingModule {}
