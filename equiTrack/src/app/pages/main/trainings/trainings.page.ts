import { Component, Input, OnInit, inject } from '@angular/core';
import { Training } from 'src/app/models/training.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTrainingComponent } from 'src/app/shared/components/add-update-training/add-update-training.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.page.html',
  styleUrls: ['./trainings.page.scss'],
})
export class TrainingsPage implements OnInit {

  @Input() training: Training;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  trainings: Training[];
  selectedDate: string = new Date().toLocaleDateString('es-ES');

  ngOnInit() {
    this.getTrainings();
  }
  async addUpdateTraining(training?: Training) {
    await this.utilsSvc.showModal({
      component: AddUpdateTrainingComponent,
      componentProps: { training },
    });
    this.getTrainings();
  }

  onDateChange(event: any) {
    this.selectedDate = new Date(event.detail.value).toLocaleDateString('es-ES');
    this.getTrainings();
  }

  getTrainings() {
    let path = '/training';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.trainings = res.filter((training: Training) => new Date(training.dateTraining).toLocaleDateString('es-ES') === this.selectedDate).sort((a: any, b: any) => new Date(a.dateTraining).getTime() - new Date(b.dateTraining).getTime());
        sub.unsubscribe(); // Desubscribirme cuando haya recuperado todos los datos

      },
    });
  }

  getTrainingTypeName(trainingType: string): string {
    switch (trainingType) {
      case 'dressage':
        return 'Doma';
      case 'jump':
        return 'Salto';
      case 'cross':
        return 'Cross';
      case 'outing':
        return 'Paseo';
      case 'paddock':
        return 'Paddock';
      default:
        return 'Desconocido';
    }
  }

  async confirmDelete(training: Training) {
    this.utilsSvc.presentAlert({
      header: 'Alert',
      message: `¿Eliminar entrenamiento?`,
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteTraining(training);
          },
        },
      ],
    });
  }

  async deleteTraining(training: Training) {
    let path = `/training/${training.key}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();


    this.firebaseSvc
      .deleteData(path)
      .then(async (res) => {
        // actualizar listado
        this.trainings = this.trainings.filter((t) => t.key !== training.key);

        // mostar mensaje exito
        this.utilsSvc.presentToast({
          message: `Entrenamiento eliminado correctamente`,
          duration: 3500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 3500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
