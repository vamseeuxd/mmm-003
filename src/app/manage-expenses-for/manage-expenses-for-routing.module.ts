import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageExpensesForPage } from './manage-expenses-for.page';

const routes: Routes = [
  {
    path: '',
    component: ManageExpensesForPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageExpensesForPageRoutingModule {}
