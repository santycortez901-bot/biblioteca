import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { InicioSesion } from './inicio-sesion/inicio-sesion';
import { Libros } from './libros/libros';
import { Prestamos } from './prestamos/prestamos';
import { Socios } from './socios/socios';
import { Cuotas } from './cuotas/cuotas';
import { Actividades } from './actividades/actividades';
import { adminGuard } from './guard/admin.guard';
import { superAdminGuard } from './guard/super-admin.guard';
import { AdminComponent } from './services/admin'; // Importas tu componente recién creado
import { GestionAdministradores } from './administradores/administradores';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'inicioSesion', component: InicioSesion },
  { path: 'inicioSeson', redirectTo: 'inicioSesion' },
  { path: 'libros', component: Libros },
  { path: 'prestamos', component: Prestamos },
  { path: 'socios', component: Socios },
  { path: 'cuotas', component: Cuotas },
  { path: 'actividades', component: Actividades },
  {
    path: 'admin/panel',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'paginas/admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'superadmin/administradores',
    component: GestionAdministradores,
    canActivate: [superAdminGuard]
  }
];