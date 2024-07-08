import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakAuthService } from './keycloak-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AclService {

  ACL: any = {

  }

  constructor(
    private keycloakauthService:KeycloakAuthService,
  ) { }

  can(permission: string): boolean {
    
    let nombreRole = this.keycloakauthService.getRoles();//['Administrador Local']
    const roles = this.ACL[permission];
    console.log('CAN roles', roles);
    return true;
    /* if (nombreRole === 'Super_Admin_role') {
      return true;
    }else{
      if (!roles) {
        //console.log('No existe rol de esta ruta', roles);
        return false;
      }else{
        return roles?.includes(nombreRole);
      }
    } */

    
  }

  isRole(roles: string[]): boolean {
    const regexRoles = new RegExp(roles.join('|'), 'i');
    let nombreRole:any = this.keycloakauthService.getRoles();
    return regexRoles.test(nombreRole);
  }
}
