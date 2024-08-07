import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'horses',
    loadChildren: () => import('./horses/horses.module').then(m => m.HorsesPageModule)
  },
  {
    path: 'employees',
    loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesPageModule)
  },
  {
    path: 'trainings',
    loadChildren: () => import('./trainings/trainings.module').then(m => m.TrainingsPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
