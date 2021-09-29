import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransactionsDetailsComponent} from './transactions-details.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsDetailsRoutingModule {
}
