import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorsesPage } from './horses.page';

const routes: Routes = [
  {
    path: '',
    component: HorsesPage
  },
  {
    path: 'medical-history/:key',
    loadChildren: () => import('../medical-history/medical-history.module').then( m => m.MedicalHistoryPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorsesPageRoutingModule {}
