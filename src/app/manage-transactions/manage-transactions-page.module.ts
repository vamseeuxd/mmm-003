import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ManageTransactionsRoutingModule} from './manage-transactions-routing.module';

import {ManageTransactionsPage} from './manage-transactions.page';
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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTransactionsRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule
  ],
  declarations: [
    ManageTransactionsPage,
    DateNavigatorComponent,
    TransactionsFormComponent
  ],
})
export class ManageTransactionsPageModule {
}
