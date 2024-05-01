import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

const base_url = environment.url_api;

interface Node {
  id?: string;
  name: string;
  content?: string;
  state?: string;
  referencia?: string;
  children?: Node[];
  isVisible?: boolean;
  isExpanded?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  constructor(
    private http: HttpClient
  ) { }


  getArticulos() {
    return this.http.get(`${base_url}/articulos`);
  }

  createArticulo(articulo:Node){
    return this.http.post(`${base_url}/articulos`, articulo);
  }

  createHijos(articulo:Node,id_padre:string, id_hijo:string ){
    return this.http.post(`${base_url}/articulos/addHijo/${id_padre}/${id_hijo}`, articulo);
  }
  
  update(articulo:Node,id_padre:any, id_hijo:any ){
    return this.http.post(`${base_url}/articulos/update/${id_padre}/${id_hijo}`, articulo);
  }

}
