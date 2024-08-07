import { Component, Input, OnInit, inject } from '@angular/core';
import { Horse } from 'src/app/models/horse.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateHorseComponent } from 'src/app/shared/components/add-update-horse/add-update-horse.component';

@Component({
  selector: 'app-horses',
  templateUrl: './horses.page.html',
  styleUrls: ['./horses.page.scss'],
})
export class HorsesPage {
  @Input() horse: Horse;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  horses: Horse[] = [];

  //cada vez que el usuario entre carge caballos
  ionViewWillEnter() {
    this.getHorses();
  }

  async addUpdateHorse(horse?: Horse) {
    let success = await this.utilsSvc.showModal({
      component: AddUpdateHorseComponent,
      componentProps: { horse },
    });

    if (success) {
      this.getHorses();
    }
  }

  getHorses() {
    let path = '/equinos';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.horses = res;
        sub.unsubscribe(); // Desubscribirme cuando haya recuperado todos los datos

      },
    });
  }

  async deleteHorse(horse: Horse) {

    let path = `/equinos/${horse.key}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getImagePath(horse.image);
    await this.firebaseSvc.deleteImage(imagePath);

    this.firebaseSvc
      .deleteData(path)
      .then(async (res) => {
        //actualizar listado sin ese caballo
        this.horses = this.horses.filter((h) => h.key !== horse.key);

        // mostar mensaje exito
        this.utilsSvc.presentToast({
          message: `Caballo eliminado correctamente`,
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async confirmDelete(horse: Horse) {
    this.utilsSvc.presentAlert({
      header: 'Alert',
      message: `¿Eliminar a ${horse.name}?`,
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteHorse(horse);
          },
        },
      ],
    });
  }

}
