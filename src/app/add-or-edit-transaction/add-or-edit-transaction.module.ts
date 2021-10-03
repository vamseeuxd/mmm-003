import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddOrEditTransactionPageRoutingModule} from './add-or-edit-transaction-routing.module';

import {AddOrEditTransactionPage} from './add-or-edit-transaction.page';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddOrEditTransactionPageRoutingModule
  ],
  declarations: [AddOrEditTransactionPage]
})
export class AddOrEditTransactionPageModule {}
