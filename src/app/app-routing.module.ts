import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-expenses/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'manage-expenses/:id',
    loadChildren: () => import('./manage-expenses/manage-expenses-page.module').then(m => m.ManageExpensesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
