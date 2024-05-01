import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {

  keycloakLoginOptions: KeycloakLoginOptions = {
    redirectUri: environment.home_page
  }
  constructor(
    private keycloakService: KeycloakService,
    private route: Router,
  ) { }

  getLoggedUser() {
    try {
      let userDetails = this.keycloakService.getKeycloakInstance().idTokenParsed;
      return userDetails;
    } catch (e) {
      return undefined
    }
  }
  logout(redirect: boolean) {
    if (redirect) {
      this.keycloakService.logout(environment.home);
    } else {
      this.keycloakService.logout();
    }

  }
  login() {
    this.keycloakService.login(this.keycloakLoginOptions);
  }
  redirectToProfile() {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }
  getRoles() {
    let roles:any = this.keycloakService.getKeycloakInstance().resourceAccess;
    if (roles!=undefined) {
      if (roles![environment.keycloakConfig.clientId]) {
        return roles![environment.keycloakConfig.clientId].roles;
      }
    }
    
    return []
  }

  redirectToMenu() {
    if (this.keycloakService.getKeycloakInstance().authenticated) {
      this.route.navigate(['']);
    }
  }
  public isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  IsAuthenticated() {
    return this.keycloakService.getKeycloakInstance().authenticated;
  }

  getToken() {
    return this.keycloakService.getToken();
  }

  keycloakEvents() {
    return this.keycloakService.keycloakEvents$.asObservable();
  }

  actualizarToken(time: number) {
    return this.keycloakService.updateToken(time);
  }

  setSesionExpirada() {
    localStorage.setItem('session_expired', 'true');
  }
  getSesionExpirada() {
    let sesion: any = localStorage.getItem('session_expired');
    return JSON.parse(sesion);
  }



}
