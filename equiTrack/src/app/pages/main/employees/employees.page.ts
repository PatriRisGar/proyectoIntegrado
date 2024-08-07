import { Component, OnInit, inject } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole: String;

  ionViewWillEnter() {
    this.getUsers();
  }

  async getUsers() {
    let path = '/users';

    let sub = this.firebaseSvc.getData(path).subscribe({
      next: (res: any) => {
        this.users = res;
        this.filteredUsers = this.users;
        sub.unsubscribe();
      },
    });
  }

  filterUsers() {
    if (!this.selectedRole) {
      this.filteredUsers = this.users;
    } else {
      if (this.selectedRole != 'all') {
        this.filteredUsers = this.users.filter(
          (user) => user.rol === this.selectedRole
        );
      } else {
        this.filteredUsers = this.users;
      }
    }
  }

  user(): User {
    return this.utilsSvc.getFromsessionStorage('user');
  }

  //foto
  async takeImage() {
    let user = this.user();
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/image}`; //aqui donde quiero que se guarde
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl); //url de la imagen

    let path = `/users/${user.uid}`;
    this.firebaseSvc
      .updateData(path, { image: user.image })
      .then(async (res) => {
        this.utilsSvc.saveInsessionStorage('user', user);
        this.getUsers();
        // mostar mensaje exito
        this.utilsSvc.presentToast({
          message: `Imagen actualizada`,
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

  //borra usuario
  // async deleteUser(user: User) {
  //   let path = `/users/${user.uid}`;

  //   const loading = await this.utilsSvc.loading();
  //   await loading.present();

  //   if (user.image) {
  //     let imagePath = await this.firebaseSvc.getImagePath(user.image);
  //     await this.firebaseSvc.deleteImage(imagePath);
  //   }

  //   this.firebaseSvc
  //     .deleteData(path)
  //     .then(async (res) => {
  //       actualizar listado sin ese usuario
  //       this.filteredUsers = this.users.filter((u) => u.uid !== user.uid);

  //       mostar mensaje exito
  //       this.utilsSvc.presentToast({
  //         message: `Usuario eliminado correctamente`,
  //         duration: 1500,
  //         color: 'success',
  //         position: 'middle',
  //         icon: 'checkmark-circle-outline',
  //       });
  //     })
  //     .catch((error) => {
  //       this.utilsSvc.presentToast({
  //         message: error.message,
  //         duration: 2500,
  //         color: 'success',
  //         position: 'middle',
  //         icon: 'alert-circle-outline',
  //       });
  //     })
  //     .finally(() => {
  //       loading.dismiss();
  //     });
  // }

  async deleteUser(user: User) {
    // Desactivo usuario
    let path = `/users/${user.uid}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    if (user.image) {
      let imagePath = await this.firebaseSvc.getImagePath(user.image);
      await this.firebaseSvc.deleteImage(imagePath);
    }

    this.firebaseSvc
      .updateData(path, { isActive: false })
      .then(async (res) => {
        // actualizar listado
        this.filteredUsers = this.users.filter((u) => u.uid !== user.uid);

        // mostar mensaje exito
        this.utilsSvc.presentToast({
          message: `Usuario eliminado correctamente`,
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

  async confirmDelete(user: User) {
    this.utilsSvc.presentAlert({
      header: 'Alert',
      message: `¿Eliminar usuario ${user.name}?`,
      mode: 'ios',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Aceptar',
          handler: () => {
            this.deleteUser(user); // Desactivo usuario
          },
        },
      ],
    });
  }
}
