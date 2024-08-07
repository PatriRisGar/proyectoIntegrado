import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getAuth } from 'firebase/auth';
import { Horse } from 'src/app/models/horse.model';
import { Training } from 'src/app/models/training.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-training',
  templateUrl: './add-update-training.component.html',
  styleUrls: ['./add-update-training.component.scss'],
})
export class AddUpdateTrainingComponent implements OnInit {
  @Input() training: Training;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  trainings: Training[] = [];
  horses: Horse[] = [];
  riders: User[] = [];
  grooms: User[] = [];
  selectedDate: Date;

  form = new FormGroup({
    key: new FormControl(''),
    trainer: new FormControl<User | null>(null),
    rider: new FormControl<User | null>(null, [Validators.required]),
    groom: new FormControl<User | null>(null, [Validators.required]),
    horse: new FormControl<Horse | null>(null, [Validators.required]),
    dateTraining: new FormControl(null, [Validators.required]),
    trainingType: new FormControl('', [Validators.required]),
  });

  async ngOnInit() {
    this.form.get('dateTraining').valueChanges.subscribe(value => {
      this.selectedDate = new Date(value);
    });
    this.getTrainings();
    this.fillSelects();
    if (this.training) this.form.setValue(this.training);
  }

  fillSelects() {
    this.getHorses();
    this.getRiders();
    this.getGrooms();
  }

  getTrainings() {
    let path = '/training';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.trainings = res;
        sub.unsubscribe(); // Desubscribirme cuando haya recuperado todos los datos
      },
    });
  }

  getHorses() {
    let path = '/equinos';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.horses = res;
        sub.unsubscribe(); // Desubscribirme cuando haya recuperado todos los datos

        if (this.training) {
          const selectedHorse = this.horses.find(
            (horse) => horse.name === this.training.horse.name
          );

          this.form.patchValue({
            horse: selectedHorse || null,
          });
        }
      },
    });
  }

  getRiders() {
    let path = '/users';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (users: User[]) => {
        this.riders = users.filter((user) => user.rol === 'rider');
        sub.unsubscribe();

        if (this.training) {
          const selectedRider = this.riders.find(
            (rider) => rider.name === this.training.rider.name
          );

          this.form.patchValue({
            rider: selectedRider || null,
          });
        }
      },
    });
  }

  getGrooms() {
    let path = '/users';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (users: User[]) => {
        this.grooms = users.filter((user) => user.rol === 'groom');
        sub.unsubscribe();

        if (this.training) {
          const selectedGroom = this.grooms.find(
            (groom) => groom.name === this.training.groom.name
          );

          this.form.patchValue({
            groom: selectedGroom || null,
          });
        }
      },
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.training) {
        this.updateTraining();
      } else {
        this.createTraining();
      }
    }
  }

  async createTraining() {
    if (this.form.valid) {
      let path = '/training';
      let findedTrainer = await this.firebaseSvc.findUserByEmail(getAuth().currentUser.email);
      let currentTrainer = findedTrainer.docs.map((user) => user.data())[0] as User;
      const today = new Date().toISOString().split('T')[0];

      if (this.selectedDate.toISOString().split('T')[0] > today) {
        this.form.controls.trainer.setValue(currentTrainer);
        delete this.form.value.key;

        this.firebaseSvc
          .addToFirebase(path, this.form.value)
          .then(async (res) => {
            //cerrar modal formulario
            this.utilsSvc.dismissModal({ success: true });
            // mostar mensaje exito
            this.utilsSvc.presentToast({
              message: `Entrenamiento añadido correctamente`,
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
      } else {
        this.utilsSvc.presentToast({
          message: 'No puede crear un entrenamiento anterior al dia de hoy',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      }
    }
  }

  async updateTraining() {
    if (this.form.valid) {
      let path = `/training/${this.training.key}`;

      delete this.form.value.key;

      this.firebaseSvc
        .updateData(path, this.form.value)
        .then(async (res) => {
          //cerrar modal formulario
          this.utilsSvc.dismissModal({ success: true });
          // mostar mensaje exito
          this.utilsSvc.presentToast({
            message: `Entrenamiento actualizado correctamente`,
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
        });
    }
  }
}
