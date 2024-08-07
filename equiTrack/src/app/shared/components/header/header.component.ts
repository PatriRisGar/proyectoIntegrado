import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() modal!: boolean;
  @Input() isLogged!: boolean;

  router = inject(Router);
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  dismissModal() {
    this.utilsSvc.dismissModal();
  }

  logOut() {
    this.firebaseSvc.logOut();
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }
}
