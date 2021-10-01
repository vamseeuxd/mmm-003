import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePayeePage } from './manage-payee.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePayeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePayeePageRoutingModule {}
