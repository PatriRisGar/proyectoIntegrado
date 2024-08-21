import { Component, Input, inject } from '@angular/core';
import { ToDo } from 'src/app/models/to-do.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  @Input() task: ToDo;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  tasks: ToDo[] = [];

  //cada vez que el usuario entre carge tareas
  ionViewWillEnter() {
    this.getTasks();
  }

  getTasks() {
    let path = '/tasks';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.tasks = res;
        sub.unsubscribe(); // Desubscribirme cuando haya recuperado todos los datos

      },
    });
  }

  async addUpdateTask(task?: ToDo) {
    let success = await this.utilsSvc.showModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
    });

    if (success) {
      this.getTasks();
    }
  }

  async deleteTodo(task: ToDo) {

    let path = `/tasks/${task.key}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc
      .deleteData(path)
      .then(async (res) => {
        //actualizar listado sin esa tarea
        this.tasks = this.tasks.filter((t) => t.key !== task.key);

        // mostar mensaje exito
        this.utilsSvc.presentToast({
          message: `Tarea eliminado correctamente`,
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
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  checkboxClick(task: ToDo) {
    this.task = task;

    let path = `/tasks/${this.task.key}`;

    this.task.status = false;
    this.firebaseSvc.updateData(path, this.task);
  }

}
