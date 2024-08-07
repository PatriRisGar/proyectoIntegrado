import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Horse } from 'src/app/models/horse.model';
import { MedicalHistory } from 'src/app/models/medicalHistory';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateMedicalHistoryComponent } from 'src/app/shared/components/add-update-medical-history/add-update-medical-history.component';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.page.html',
  styleUrls: ['./medical-history.page.scss']
})
export class MedicalHistoryPage {
  activatedRoute = inject(ActivatedRoute);

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  horse: Horse;
  horseUID: string;
  medicalHistories: MedicalHistory[] = [];
  medicalHistory: MedicalHistory;
  isMedicalHistory: boolean;
  vaccinesFilter: string[];
  tratmentFilter: string[];

  ionViewWillEnter() {
    this.horseUID = this.activatedRoute.snapshot.paramMap.get('key');
    this.getHorseInfo(this.horseUID);
  }

  async getHorseInfo(uid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let path = `equinos/${uid}`;

    this.firebaseSvc
      .getHorse(path)
      .then((horse: Horse) => {
        this.horse = horse;
        this.getMedicalHistories();

        this.utilsSvc.presentToast({
          message: `Historial clínico de ${horse.name}`,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'id-card-outline',
        });
      })
      .catch((error) => {
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async getMedicalHistories() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.medicalHistories = [];

    if (this.horse.medicalHistoryReference) {
      for (const medicalHistoryKey of this.horse.medicalHistoryReference) {
        const data = await this.firebaseSvc.getMedicalHistory('/medicalHistory/' + medicalHistoryKey)
        let medicalHistory = data as MedicalHistory;
        medicalHistory.key = medicalHistoryKey
        this.medicalHistories.push(medicalHistory);
      }
    }
    this.vaccinesFilter = null;
    this.tratmentFilter = null;
    loading.dismiss();
  }

  async eventOpenModalEdit(horse: Horse, horseUID: string, medicalHistory: MedicalHistory) {
    this.addUpdateMedicalHistory(horse, horseUID, medicalHistory as MedicalHistory, false);
  }

  async addUpdateMedicalHistory(horse: Horse, horseUID: string, medicalHistory?: MedicalHistory, isMedicalHistory?: boolean) {
    const edit = this.eventOpenModalEdit;
    const update = this.getMedicalHistories;
    this.utilsSvc.dismissModal({ success: true });
    let success = await this.utilsSvc.showModal({
      component: AddUpdateMedicalHistoryComponent,
      componentProps: { horse, horseUID, medicalHistory, isMedicalHistory, edit, update },
    });
    if (success) {
      this.getMedicalHistories();
    }
  }

  async heartOnClick() {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    await this.getMedicalHistories();
    this.vaccinesFilter = this.medicalHistories.filter(history => history.vaccine).map(history => {
      const visitDate = new Date(history.visitDate).toLocaleDateString('es-ES');
      return `${visitDate} - ${history.vaccine}`;
    });

    loading.dismiss();
  }

  async medkitOnClick() {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    await this.getMedicalHistories();
    this.tratmentFilter = this.medicalHistories.filter(history => history.tratment).map(history => {
      const visitDate = new Date(history.visitDate).toLocaleDateString('es-ES');
      return `${visitDate} - ${history.tratment} `;
    });

    loading.dismiss();
  }
}
