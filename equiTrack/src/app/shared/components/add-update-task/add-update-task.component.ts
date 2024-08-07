import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToDo } from 'src/app/models/to-do.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent implements OnInit {
  @Input() task: ToDo;

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  form = new FormGroup({
    key: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  ngOnInit() {
    if (this.task) {
      this.form.setValue(this.task);
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.task) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }
  async createTask() {
    if (this.form.valid) {
      let path = '/tasks';

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .addToFirebase(path, this.form.value)
        .then((res) => {
          //cerrar modal formulario
          this.utilsSvc.dismissModal({ success: true });
          // mostar mensaje exito
          this.utilsSvc.presentToast({
            message: `Tarea añadida correctamente`,
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
        }).finally(() => {
          loading.dismiss();
        });;
    }
  }
  async updateTask() {
    if (this.form.valid) {
      let path = `/tasks/${this.task.key}`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      delete this.form.value.key;

      this.firebaseSvc
        .updateData(path, this.form.value)
        .then(async (res) => {
          //cerrar modal formulario
          this.utilsSvc.dismissModal({ success: true });
          // mostar mensaje exito
          this.utilsSvc.presentToast({
            message: `Tarea actualizada correctamente`,
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
        }).finally(() => {
          loading.dismiss();
        });;
    }
  }
}
