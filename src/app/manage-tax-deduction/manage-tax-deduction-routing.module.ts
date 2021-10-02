import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTaxDeductionPage } from './manage-tax-deduction.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTaxDeductionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTaxDeductionPageRoutingModule {}
