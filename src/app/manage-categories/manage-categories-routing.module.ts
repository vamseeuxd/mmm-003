import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCategoriesPage } from './manage-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCategoriesPageRoutingModule {}
