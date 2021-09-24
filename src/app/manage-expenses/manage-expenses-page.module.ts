import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageExpensesRoutingModule} from './manage-expenses-routing.module';

import {ManageExpensesPage} from './manage-expenses.page';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {DateNavigatorComponent} from '../shared/date-navigator/date-navigator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageExpensesRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTabsModule
  ],
  declarations: [
    ManageExpensesPage,
    DateNavigatorComponent,
    TransactionsFormComponent
  ]
})
export class ManageExpensesPageModule {
}
