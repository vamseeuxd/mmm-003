import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOrEditCategoryPage } from './add-or-edit-category.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrEditCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrEditCategoryPageRoutingModule {}
