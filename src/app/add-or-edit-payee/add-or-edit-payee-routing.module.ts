import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrEditPayeePage } from './add-or-edit-payee.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrEditPayeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrEditPayeePageRoutingModule {}
