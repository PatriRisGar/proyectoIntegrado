import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  // añadir a base de datos
  async addToFirebase(path: string, data: any) {
    return await addDoc(collection(getFirestore(), path), data);
  }
  // Recuperar info ddbb
  getData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'key' });
  }

  //actualizar info bbdd
  updateData(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //Borrar info bbdd
  deleteData(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // subir Imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  // recuperar ruta imagen
  async getImagePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // eliminar imagen
  deleteImage(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

  // Credenciales Usuario
  // Acceso
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Crear
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Actualizar
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Cambiar contraseña
  sendRecovery(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Guardar datos usuario
  setUser(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Obtener datos usuario
  async getUser(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  async findUserByEmail(email: string) {
    return await this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise();
  }

  // usuario logado
  getAuth() {
    return getAuth();
  }

  //deslogar
  logOut() {
    getAuth().signOut();
    sessionStorage.removeItem('user');

    this.utilsSvc.routerLink('/auth');
  }

  // Obtener datos caballo
  async getHorse(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Obtener datos clinicos
  async getMedicalHistory(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  async findTaskID(taskName) {
    return await this.firestore
      .collection('tasks', (ref) => ref.where('name', '==', taskName))
      .get()
      .toPromise();
  }
}
