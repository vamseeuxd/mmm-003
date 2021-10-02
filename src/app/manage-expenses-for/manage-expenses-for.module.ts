import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageExpensesForPageRoutingModule} from './manage-expenses-for-routing.module';

import {ManageExpensesForPage} from './manage-expenses-for.page';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ManageExpensesForPageRoutingModule,
    DragDropModule
  ],
  declarations: [ManageExpensesForPage]
})
export class ManageExpensesForPageModule {}
