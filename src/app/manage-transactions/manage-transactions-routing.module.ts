import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ManageTransactionsPage} from './manage-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTransactionsRoutingModule {
}
