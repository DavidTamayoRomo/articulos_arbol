import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

const base_url = environment.url_api;
const clienteId = environment.keycloakConfig.clientId;

@Injectable({
  providedIn: 'root'
})
export class KeycloakBackService {

  constructor(
    private http: HttpClient
  ) { }


  getClient(clientId:string) {
    return this.http.get(`${base_url}/keycloak/get-client/${clientId}`);
  }

  getRolUserClient(clientId:string, userId:string){
    return this.http.get(`${base_url}/keycloak/get-rol-user-client/${clientId}/${userId}`);
  }

  quitarRol(ssoId:string, listaRoles:any){
    return this.http.delete(`${base_url}/wso2/quitar-roles/${clienteId}/${ssoId}`, {body: listaRoles });
  }
}
