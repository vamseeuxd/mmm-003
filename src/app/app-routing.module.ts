import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-transactions',
    pathMatch: 'full'
  },
  {
    path: 'manage-transactions',
    loadChildren: () => import('./manage-transactions/manage-transactions-page.module').then(m => m.ManageTransactionsPageModule)
  },
  {
    path: 'manage-categories',
    loadChildren: () => import('./manage-categories/manage-categories.module').then(m => m.ManageCategoriesPageModule)
  },
  {
    path: 'transactions-details/:transactionId/:dueDate',
    loadChildren: () => import('./transactions-details/transactions-details-page.module').then(m => m.TransactionsDetailsPageModule)
  },
  {
    path: 'add-or-edit-category/:type',
    loadChildren: () => import('./add-or-edit-category/add-or-edit-category.module').then( m => m.AddOrEditCategoryPageModule)
  },
  {
    path: 'add-or-edit-category/:type/:id',
    loadChildren: () => import('./add-or-edit-category/add-or-edit-category.module').then( m => m.AddOrEditCategoryPageModule)
  },
  {
    path: 'add-or-edit-payee',
    loadChildren: () => import('./add-or-edit-payee/add-or-edit-payee.module').then( m => m.AddOrEditPayeePageModule)
  },
  {
    path: 'add-or-edit-payee/:id',
    loadChildren: () => import('./add-or-edit-payee/add-or-edit-payee.module').then( m => m.AddOrEditPayeePageModule)
  },
  {
    path: 'manage-payee',
    loadChildren: () => import('./manage-payee/manage-payee.module').then( m => m.ManagePayeePageModule)
  },
  {
    path: 'manage-payers',
    loadChildren: () => import('./manage-payers/manage-payers.module').then( m => m.ManagePayersPageModule)
  },
  {
    path: 'add-or-edit-payer',
    loadChildren: () => import('./add-or-edit-payer/add-or-edit-payer.module').then( m => m.AddOrEditPayerPageModule)
  },
  {
    path: 'add-or-edit-payer/:id',
    loadChildren: () => import('./add-or-edit-payer/add-or-edit-payer.module').then( m => m.AddOrEditPayerPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
