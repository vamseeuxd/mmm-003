import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-transactions/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'manage-transactions/:id',
    loadChildren: () => import('./manage-transactions/manage-transactions-page.module').then(m => m.ManageTransactionsPageModule)
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
