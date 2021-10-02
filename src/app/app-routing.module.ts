import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectDashboard = () => redirectLoggedInTo(['manage-transactions']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'manage-transactions',
    loadChildren: () => import('./manage-transactions/manage-transactions-page.module').then(m => m.ManageTransactionsPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'manage-categories',
    loadChildren: () => import('./manage-categories/manage-categories.module').then(m => m.ManageCategoriesPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'transactions-details/:transactionId/:dueDate',
    loadChildren: () => import('./transactions-details/transactions-details-page.module').then(m => m.TransactionsDetailsPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-category/:type',
    loadChildren: () => import('./add-or-edit-category/add-or-edit-category.module').then( m => m.AddOrEditCategoryPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-category/:type/:id',
    loadChildren: () => import('./add-or-edit-category/add-or-edit-category.module').then( m => m.AddOrEditCategoryPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-payee',
    loadChildren: () => import('./add-or-edit-payee/add-or-edit-payee.module').then( m => m.AddOrEditPayeePageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-payee/:id',
    loadChildren: () => import('./add-or-edit-payee/add-or-edit-payee.module').then( m => m.AddOrEditPayeePageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'manage-payee',
    loadChildren: () => import('./manage-payee/manage-payee.module').then( m => m.ManagePayeePageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'manage-payers',
    loadChildren: () => import('./manage-payers/manage-payers.module').then( m => m.ManagePayersPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-payer',
    loadChildren: () => import('./add-or-edit-payer/add-or-edit-payer.module').then( m => m.AddOrEditPayerPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-edit-payer/:id',
    loadChildren: () => import('./add-or-edit-payer/add-or-edit-payer.module').then( m => m.AddOrEditPayerPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'manage-expenses-for',
    loadChildren: () => import('./manage-expenses-for/manage-expenses-for.module').then( m => m.ManageExpensesForPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-expenses-for',
    loadChildren: () => import('./add-or-expenses-for/add-or-expenses-for.module').then( m => m.AddOrExpensesForPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'add-or-expenses-for/:id',
    loadChildren: () => import('./add-or-expenses-for/add-or-expenses-for.module').then( m => m.AddOrExpensesForPageModule),
    data: {authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    data: {authGuardPipe: redirectDashboard}
  },
  {
    path: 'manage-tax-deduction',
    loadChildren: () => import('./manage-tax-deduction/manage-tax-deduction.module').then( m => m.ManageTaxDeductionPageModule)
  },
  {
    path: 'add-or-edit-tax-deduction',
    loadChildren: () => import('./add-or-edit-tax-deduction/add-or-edit-tax-deduction.module').then( m => m.AddOrEditTaxDeductionPageModule)
  },
  {
    path: 'add-or-edit-tax-deduction/:id',
    loadChildren: () => import('./add-or-edit-tax-deduction/add-or-edit-tax-deduction.module').then( m => m.AddOrEditTaxDeductionPageModule)
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
