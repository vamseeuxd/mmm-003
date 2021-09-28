import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageTransactionsRoutingModule} from './manage-transactions-routing.module';

import {ManageTransactionsPage} from './manage-transactions.page';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {TransactionsDetailsComponent} from './transactions-details/transactions-details.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTransactionsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ManageTransactionsPage,
    TransactionsDetailsComponent,
    TransactionsFormComponent
  ],
})
export class ManageTransactionsPageModule {
}
