import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebounceClickDirective} from './shared/directives/debounce-click/debounce-click.directive';
import {DateNavigatorComponent} from './shared/components/date-navigator/date-navigator.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MarkAsPaidComponent} from './shared/components/mark-as-paid/mark-as-paid.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    DebounceClickDirective,
    DateNavigatorComponent,
    MarkAsPaidComponent,
  ],
  imports: [
    CommonModule,
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
    MatCardModule,
    FormsModule,
  ],
  exports: [
    DebounceClickDirective,
    DateNavigatorComponent,
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
    MatCardModule,
    MarkAsPaidComponent,
  ]
})
export class SharedModule {
}
