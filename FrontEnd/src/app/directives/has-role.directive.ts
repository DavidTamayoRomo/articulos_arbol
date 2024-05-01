import { Directive, ElementRef, Input, OnChanges, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AclService } from '../auth/services/acl.service';

@Directive({
  standalone: true,
  selector: '[hasRole]'
})
export class HasRoleDirective {

  roles: string[] = [];

  constructor(
    private aclService: AclService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input()
  set hasRole(val: any) {
    this.roles = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  private updateView() {
    if (this.aclService.isRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
