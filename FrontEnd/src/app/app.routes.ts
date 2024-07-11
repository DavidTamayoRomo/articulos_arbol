import { Routes } from '@angular/router';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { adminGuard } from './core/guards/admin.guard';
import { PruebaPageComponent } from './modules/public/prueba-page/prueba-page.component';
import { ListaArticulosComponent } from './modules/admin/lista-articulos/lista-articulos.component';
import { ContenidoComponent } from './modules/public/contenido/contenido.component';
import { ContenidoComponentPublico } from './modules/public/historial/contenido/contenido.component';

export const APP_ROUTES: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [adminGuard]
    },
    {
        path: '',
        component: ContenidoComponent
    },
    {path: 'articulos', component: ContenidoComponent},
    {path: 'historial/:id', component: ContenidoComponentPublico},
    {path: 'internal-error', component: InternalErrorComponent},
    {path: '**', redirectTo: 'articulos'}
];