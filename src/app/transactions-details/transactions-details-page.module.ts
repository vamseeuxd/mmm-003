import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TransactionsDetailsRoutingModule} from './transactions-details-routing.module';
import {TransactionsDetailsComponent} from './transactions-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsDetailsRoutingModule,
    SharedModule,
    DragDropModule,
  ],
  declarations: [
    TransactionsDetailsComponent,
  ],
})
export class TransactionsDetailsPageModule {
}
