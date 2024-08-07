import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorsesPageRoutingModule } from './horses-routing.module';

import { HorsesPage } from './horses.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorsesPageRoutingModule,
    SharedModule
  ],
  declarations: [HorsesPage]
})
export class HorsesPageModule {}
