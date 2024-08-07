import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { collection, query, where } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Buscar mail en firestore
      const users = await this.firebaseSvc.findUserByEmail(
        this.form.value.email
      );
      
      if (users.docs.map((user) => user.data()).length == 1) {
        this.firebaseSvc.sendRecovery(this.form.value.email).then((res) => {
          this.utilsSvc.presentToast({
            message: 'Revise su mail',
            duration: 4500,
            color: 'primary',
            position: 'middle',
            icon: 'mail-outline',
          });
          this.utilsSvc.routerLink('/auth');
          this.form.reset();
          loading.dismiss();
        });
      } else {
        loading.dismiss();
        this.utilsSvc.presentToast({
          message: 'Correo no registrado',
          duration: 4500,
          color: 'danger',
          position: 'middle',
          icon: 'mail-outline',
        });
        this.utilsSvc.routerLink('/auth/sign-up');
        this.form.reset();
      }
    }
  }
}
