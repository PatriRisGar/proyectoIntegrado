import { NgModule, inject } from '@angular/core';
import {
  CanActivateFn,
  PreloadAllModules,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { UtilsService } from './services/utils.service';

export const isLogged: CanActivateFn = () => {

  if (sessionStorage.getItem('user') && inject(UtilsService).getFromsessionStorage('user').isActive == true ) {
    return true;

  } else {    
    inject(UtilsService).presentToast({
      message: 'No está autorizado.',
      duration: 3500,
      color: 'danger',
      position: 'middle',
      icon: 'alert-circle-outline',
    });

    return inject(Router).createUrlTree(['/auth']);
  }
};

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'employees',
    canActivate: [isLogged],
    loadChildren: () => import('./pages/main/employees/employees.module').then( m => m.EmployeesPageModule)
  },
  {
    path: 'horses',
    canActivate: [isLogged],
    loadChildren: () =>
      import('./pages/main/horses/horses.module').then(
        (m) => m.HorsesPageModule
      ),
  },
  {
    path: 'home',
    canActivate: [isLogged],
    loadChildren: () =>
      import('./pages/main/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'trainings',
    loadChildren: () => import('./pages/main/trainings/trainings.module').then( m => m.TrainingsPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/main/tasks/tasks.module').then( m => m.TasksPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
