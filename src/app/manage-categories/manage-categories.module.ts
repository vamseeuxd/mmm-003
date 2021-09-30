import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageCategoriesPageRoutingModule} from './manage-categories-routing.module';

import {ManageCategoriesPage} from './manage-categories.page';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ManageCategoriesPageRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        SharedModule,
        DragDropModule
    ],
  declarations: [ManageCategoriesPage]
})
export class ManageCategoriesPageModule {
}
