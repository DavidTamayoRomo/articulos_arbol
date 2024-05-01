import { Routes } from '@angular/router';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { adminGuard } from './core/guards/admin.guard';
import { PruebaPageComponent } from './modules/public/prueba-page/prueba-page.component';
import { ListaArticulosComponent } from './modules/admin/lista-articulos/lista-articulos.component';
import { ContenidoComponent } from './modules/public/contenido/contenido.component';

export const APP_ROUTES: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [adminGuard]
    },
    {
        path: '',
        component: PruebaPageComponent
    },
    {path: 'articulos', component: ContenidoComponent},
    {path: 'internal-error', component: InternalErrorComponent},
    {path: '**', redirectTo: 'articulos'}
    // Here add new pages component
    /* {path: '**', component: NotFoundComponent} */ // This line will remain down from the whole pages component list
];