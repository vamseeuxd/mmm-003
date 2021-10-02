import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddOrExpensesForPageRoutingModule} from './add-or-expenses-for-routing.module';

import {AddOrExpensesForPage} from './add-or-expenses-for.page';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddOrExpensesForPageRoutingModule
  ],
  declarations: [AddOrExpensesForPage]
})
export class AddOrExpensesForPageModule {}
