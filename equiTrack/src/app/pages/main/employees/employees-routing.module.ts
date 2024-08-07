import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesPage } from './employees.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeesPage
  },
  
  {
    path: 'sign-up',
    loadChildren: () => import('../../auth/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesPageRoutingModule {}
