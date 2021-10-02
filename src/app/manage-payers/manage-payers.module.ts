import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManagePayersPageRoutingModule} from './manage-payers-routing.module';

import {ManagePayersPage} from './manage-payers.page';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ManagePayersPageRoutingModule,
    DragDropModule
  ],
  declarations: [ManagePayersPage]
})
export class ManagePayersPageModule {}
