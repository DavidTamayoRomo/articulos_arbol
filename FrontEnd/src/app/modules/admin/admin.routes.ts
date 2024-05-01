import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';
import { AuthKeycloakGuard } from '../../core/guards/auth-keycloak.guard';
import { ListaArticulosComponent } from './lista-articulos/lista-articulos.component';
import { ContenidoComponent } from './contenido/contenido.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivate: [AuthKeycloakGuard],
    children: [
      {
        path:'lista-articulos',
        component:ListaArticulosComponent
      },
      {
        path:'contenido',
        component:ContenidoComponent
      },
      {
        path:'usuarios',
        component:UsuariosComponent
      },
    ]
  }
];


