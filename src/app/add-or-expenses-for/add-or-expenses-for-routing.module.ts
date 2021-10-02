import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrExpensesForPage } from './add-or-expenses-for.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrExpensesForPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrExpensesForPageRoutingModule {}
