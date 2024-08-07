import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Horse } from 'src/app/models/horse.model';
import { MedicalHistory } from 'src/app/models/medicalHistory';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-medical-history',
  templateUrl: './add-update-medical-history.component.html',
  styleUrls: ['./add-update-medical-history.component.scss'],
})
export class AddUpdateMedicalHistoryComponent implements OnInit {
  @Input() horse?: Horse;
  @Input() horseUID?: string;
  @Input() medicalHistory?: MedicalHistory;
  @Input() isMedicalHistory?: boolean;
  @Output() editEvent = new EventEmitter<any>();


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    key: new FormControl(''),
    horse: new FormControl<Horse | null>(null),
    visitDate: new FormControl(null, [Validators.required]),
    reason: new FormControl('', [Validators.required, Validators.minLength(5)]),
    diagnosis: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    tratment: new FormControl(''),
    vaccine: new FormControl(''),
  });

  ngOnInit() {
    if (this.medicalHistory) {
      this.form.setValue(this.medicalHistory);
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.medicalHistory) {
        this.updateMedicalHistory();
      } else {
        this.createMedicalHistory();
      }
    }
  }

  async createMedicalHistory() {
    if (this.form.valid) {
      let path = '/medicalHistory';

      this.form.controls.horse.setValue(this.horse);
      delete this.form.value.key;

      this.firebaseSvc
        .addToFirebase(path, this.form.value)
        .then((res) => {

          //añadir al array del caballo la nueva referencia de historial.
          if (!this.horse.medicalHistoryReference) {
            this.horse.medicalHistoryReference = [res.path.split('/')[1]]
          } else {
            this.horse.medicalHistoryReference.push(res.path.split('/')[1]);
          }

          this.firebaseSvc.updateData(`/equinos/${this.horseUID}`, this.horse)

          //cerrar modal formulario
          this.utilsSvc.dismissModal({ success: true });

          // mostar mensaje exito
          this.utilsSvc.presentToast({
            message: `Nueva visita veterinaria añadida correctamente`,
            duration: 3500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
        })
        .catch((error) => {
          this.utilsSvc.presentToast({
            message: error.message,
            duration: 4500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        });
    }
  }

  edit(horse: Horse, horseUID: string, medicalHistory: MedicalHistory) {
  }
  update() {
    window.location.reload();
  }

  async addUpdateMedicalHistory(horse?: Horse, horseUID?: string, medicalHistory?: MedicalHistory, isMedicalHistory?: boolean) {
    this.utilsSvc.dismissModal({ success: true });
    let success = await this.utilsSvc.showModal({
      component: AddUpdateMedicalHistoryComponent,
      componentProps: { horse, horseUID, medicalHistory, isMedicalHistory },
    });
    if (!success) {
      this.update();
    }
  }

  async updateMedicalHistory() {
    if (this.form.valid) {

      let path = `/medicalHistory/${this.medicalHistory.key}`;

      //seteo el objeto en local
      delete this.form.value.key;
      this.medicalHistory.visitDate = this.form.value.visitDate;
      this.medicalHistory.reason = this.form.value.reason;
      this.medicalHistory.diagnosis = this.form.value.diagnosis;
      this.medicalHistory.tratment = this.form.value.tratment;
      this.medicalHistory.vaccine = this.form.value.vaccine;

      this.firebaseSvc
        .updateData(path, this.form.value)
        .then(async (res) => {
          //cerrar modal formulario
          this.utilsSvc.dismissModal({ success: true });
          // mostar mensaje exito
          this.utilsSvc.presentToast({
            message: `Visita veterinaria actualizada correctamente`,
            duration: 3500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
        })
        .catch((error) => {
          this.utilsSvc.presentToast({
            message: error.message,
            duration: 4500,
            color: 'success',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        });
    }
  }

  async confirmDelete(medicalHistory: MedicalHistory) {
    this.utilsSvc.presentAlert({
      header: 'Alert',
      message: `¿Eliminar visita veterinaria?`,
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteMedicalHistory(medicalHistory);
          },
        },
      ],
    });
  }

  async deleteMedicalHistory(medicalHistory: MedicalHistory) {
    let path = `/medicalHistory/${medicalHistory.key}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // borrar visitaVeterinaria
    this.firebaseSvc
      .deleteData(path)
      .then(async (res) => {
        // borrar del array del caballo y actualizar en firebase
        this.horse.medicalHistoryReference = this.horse.medicalHistoryReference.filter(key => key !== String(medicalHistory.key));

        path = `/equinos/${this.horseUID}`;
        this.firebaseSvc
          .updateData(path, this.horse)
          .then(async (res) => {
            //cerrar modal formulario
            this.utilsSvc.dismissModal({ success: true });
            // mostar mensaje exito
            this.utilsSvc.presentToast({
              message: `Visita veterinaria eliminada correctamente`,
              duration: 3500,
              color: 'success',
              position: 'middle',
              icon: 'checkmark-circle-outline',
            });
          }).catch((error) => {
            this.utilsSvc.presentToast({
              message: error.message,
              duration: 4500,
              color: 'danger',
              position: 'middle',
              icon: 'alert-circle-outline',
            });
          }).finally(() => {
            loading.dismiss();
          });
      });
  }
}