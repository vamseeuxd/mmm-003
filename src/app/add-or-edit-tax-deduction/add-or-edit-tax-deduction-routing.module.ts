import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrEditTaxDeductionPage } from './add-or-edit-tax-deduction.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrEditTaxDeductionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrEditTaxDeductionPageRoutingModule {}
