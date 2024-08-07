import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  AlertOptions,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  alertCrt = inject(AlertController);
  actionSheetCtrl = inject(ActionSheetController);
  router = inject(Router);

  // Loading
  loading() {
    return this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
    });
  }
  // toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //Alert
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCrt.create(opts);

    await alert.present();
  }

  //Enruta a la pagina pasada por url
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // guardar en bbdd
  saveInsessionStorage(key: string, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }

  // obtener de bbdd
  getFromsessionStorage(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  // Abrir modal
  async showModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    //enviar datos al cerrar
    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }

  // Cerrar modal
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async takePicture() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Abrir... ',
      promptLabelPhoto: 'Galería',
      promptLabelPicture: 'Cámara',
    });
  }
}
