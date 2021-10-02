import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageTaxDeductionPageRoutingModule} from './manage-tax-deduction-routing.module';

import {ManageTaxDeductionPage} from './manage-tax-deduction.page';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ManageTaxDeductionPageRoutingModule,
    DragDropModule
  ],
  declarations: [ManageTaxDeductionPage]
})
export class ManageTaxDeductionPageModule {}
