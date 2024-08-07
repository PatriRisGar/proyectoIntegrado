import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          this.utilsSvc.presentToast({
            message: 'El usuario o contraseña son incorrectos',
            duration: 3500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getUser(path)
        .then((user: User) => {
          sessionStorage.clear();
          this.utilsSvc.saveInsessionStorage('user', user);
          this.utilsSvc.routerLink('/home');
          this.form.reset();

          this.utilsSvc.presentToast({
            message: `Acceso permitido ${user.name}`,
            duration: 3500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
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
  }
}
