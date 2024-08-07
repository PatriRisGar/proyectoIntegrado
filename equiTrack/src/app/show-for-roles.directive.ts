import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { UtilsService } from './services/utils.service';

@Directive({
  selector: '[appShowForRoles]',
  standalone: true,
})
export class ShowForRolesDirective implements OnInit {
  @Input('appShowForRoles') allowedUser?: String[]; // unas veces recibe array de roles y otras el uid del usuario

  utilsSvc = inject(UtilsService);
  viewContainerRef = inject(ViewContainerRef);
  templateRef = inject(TemplateRef<any>);

  ngOnInit(): void {
    if (
      this.allowedUser.includes(this.utilsSvc.getFromsessionStorage('user').rol)
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else if (
      this.allowedUser.includes(this.utilsSvc.getFromsessionStorage('user').uid)
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();      
    }
  }
}
