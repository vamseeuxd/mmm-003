import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManagePayeePageRoutingModule} from './manage-payee-routing.module';

import {ManagePayeePage} from './manage-payee.page';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ManagePayeePageRoutingModule,
    DragDropModule
  ],
  declarations: [ManagePayeePage]
})
export class ManagePayeePageModule {}
