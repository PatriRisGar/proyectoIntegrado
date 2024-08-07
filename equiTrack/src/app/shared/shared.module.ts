import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddUpdateHorseComponent } from './components/add-update-horse/add-update-horse.component';
import { ShowForRolesDirective } from '../show-for-roles.directive';
import { AddUpdateTrainingComponent } from './components/add-update-training/add-update-training.component';
import { AddUpdateMedicalHistoryComponent } from './components/add-update-medical-history/add-update-medical-history.component';
import { AddUpdateTaskComponent } from './components/add-update-task/add-update-task.component';


@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateHorseComponent,
    AddUpdateTrainingComponent,
    AddUpdateMedicalHistoryComponent,
    AddUpdateTaskComponent,
    ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateHorseComponent,
    ShowForRolesDirective,
    AddUpdateTrainingComponent,
    AddUpdateMedicalHistoryComponent,
    AddUpdateTaskComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, ShowForRolesDirective],
})
export class SharedModule {}
