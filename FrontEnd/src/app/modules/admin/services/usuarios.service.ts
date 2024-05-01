import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

const base_url = environment.url_api;
const clienteId = environment.keycloakConfig.clientId;


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }


  getUsuarioApellido(apellido:string) {
    return this.http.get(`${base_url}/wso2/get-users-lastName/${apellido}`);
  }


  getRoles() {
    return this.http.get(`${base_url}/wso2/get-roles/${clienteId}`);
  }

  guardarRol(roles:any, ssoId:string){
    return this.http.post(`${base_url}/wso2/agregar-roles/${clienteId}/${ssoId}`, roles);
  }

  

}
