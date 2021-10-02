import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddOrEditTaxDeductionPageRoutingModule} from './add-or-edit-tax-deduction-routing.module';

import {AddOrEditTaxDeductionPage} from './add-or-edit-tax-deduction.page';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddOrEditTaxDeductionPageRoutingModule
  ],
  declarations: [AddOrEditTaxDeductionPage]
})
export class AddOrEditTaxDeductionPageModule {}
