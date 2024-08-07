import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Horse } from 'src/app/models/horse.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-horse',
  templateUrl: './add-update-horse.component.html',
  styleUrls: ['./add-update-horse.component.scss'],
})
export class AddUpdateHorseComponent implements OnInit {
  @Input() horse: Horse;

  selectedDate: Date;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  form = new FormGroup({
    key: new FormControl(''),
    medicalHistoryReference: new FormControl([]),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    breed: new FormControl('', [Validators.required, Validators.minLength(4)]),
    coat: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dateBirth: new FormControl(null, [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    breeding: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {
    this.form.get('dateBirth').valueChanges.subscribe(value => {
      this.selectedDate = new Date(value);
    });
    if (this.horse) {
      this.form.setValue(this.horse);
    }
  }

  //foto
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.horse) {
        this.updateHorse();
      } else {
        this.createHorse();
      }
    }
  }

  async createHorse() {
    if (this.form.valid) {
      let path = '/equinos';
      const today = new Date().toISOString().split('T')[0];

      if (this.selectedDate.toISOString().split('T')[0] < today) {

        // subir image y conocer url
        let dataUrl = this.form.value.image; //esta es la imagen
        let imagePath = `${Date.now()}`; //aqui donde quiero que se guarde
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl); //url de la imagen
        this.form.controls.image.setValue(imageUrl); // para guardar la url con el formulario

        delete this.form.value.key;

        this.firebaseSvc
          .addToFirebase(path, this.form.value)
          .then((res) => {
            //cerrar modal formulario
            this.utilsSvc.dismissModal({ success: true });
            // mostar mensaje exito
            this.utilsSvc.presentToast({
              message: `Caballo ${this.form.value.name} añadido correctamente`,
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
      this.utilsSvc.presentToast({
        message: 'No puede haber nacido aún. Revise la fecha de nacimiento',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

  async updateHorse() {
    if (this.form.valid) {
      let path = `/equinos/${this.horse.key}`;

      const today = new Date().toISOString().split('T')[0];

      if (this.selectedDate.toISOString().split('T')[0] < today) {

        // subir image y conocer url
        if (this.form.value.image !== this.horse.image) {
          let dataUrl = this.form.value.image; //esta es la imagen
          let imagePath = await this.firebaseSvc.getImagePath(this.horse.image); //aqui donde quiero que se guarde
          let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl); //url de la imagen
          this.form.controls.image.setValue(imageUrl); // para guardar la url con el formulario
        }

        delete this.form.value.key;

        this.firebaseSvc
          .updateData(path, this.form.value)
          .then(async (res) => {
            //cerrar modal formulario
            this.utilsSvc.dismissModal({ success: true });
            // mostar mensaje exito
            this.utilsSvc.presentToast({
              message: `Caballo ${this.form.value.name} actualizado correctamente`,
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
  }
}
