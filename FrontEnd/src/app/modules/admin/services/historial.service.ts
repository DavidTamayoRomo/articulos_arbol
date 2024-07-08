import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

const base_url = environment.url_api; 


@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor(
    private http: HttpClient
  ) { }


  getHistorialById(id:string) {
    return this.http.get(`${base_url}/historial/${id}`);
  }

  

}
