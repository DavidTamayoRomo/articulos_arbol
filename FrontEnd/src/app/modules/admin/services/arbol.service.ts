import { Injectable } from '@angular/core';

interface Node {
  id?: string;
  name: string;
  content?: string;
  state?: string;
  children?: Node[];
  isVisible?: boolean;
  isExpanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ArbolService {
  private raiz: Node = {
    id:"1",
    name: 'CAPITULO I',
    content: 'Informacion de capitulo 1',
    state: 'Activo',
    children: [{ name: 'Articulo 1' }, { name: 'Articulo 2' }, { name: 'Articulo 3' }],
  };

  constructor() { }

  agregarNodo(padreId: string, nodo: any): void {
    const padre = this.encontrarNodo(padreId, this.raiz);
    if (padre) {
      if (!padre.children) {
        padre.children = [];
      }
      padre.children.push(nodo);
    }
  }

  private encontrarNodo(id: string, nodo: Node): Node | null {
    if (nodo.id === id) {
      return nodo;
    }
    if (nodo.children) {
      for (let hijo of nodo.children) {
        const resultado = this.encontrarNodo(id, hijo);
        if (resultado) {
          return resultado;
        }
      }
    }
    return null;
  }
}
