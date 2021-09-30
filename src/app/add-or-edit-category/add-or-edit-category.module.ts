import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddOrEditCategoryPageRoutingModule} from './add-or-edit-category-routing.module';

import {AddOrEditCategoryPage} from './add-or-edit-category.page';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AddOrEditCategoryPageRoutingModule
  ],
  declarations: [AddOrEditCategoryPage]
})
export class AddOrEditCategoryPageModule {
}
