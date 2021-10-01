import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddOrEditPayeePageRoutingModule} from './add-or-edit-payee-routing.module';

import {AddOrEditPayeePage} from './add-or-edit-payee.page';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddOrEditPayeePageRoutingModule
  ],
  declarations: [AddOrEditPayeePage]
})
export class AddOrEditPayeePageModule {}
