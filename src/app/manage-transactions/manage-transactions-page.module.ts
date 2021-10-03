import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageTransactionsRoutingModule} from './manage-transactions-routing.module';

import {ManageTransactionsPage} from './manage-transactions.page';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTransactionsRoutingModule,
    SharedModule,
    DragDropModule,
  ],
  declarations: [
    ManageTransactionsPage,
  ],
})
export class ManageTransactionsPageModule {
}
