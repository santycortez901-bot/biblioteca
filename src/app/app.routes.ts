import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { InicioSesion } from './inicio-sesion/inicio-sesion';
import { Libros } from './libros/libros';
import { Prestamos } from './prestamos/prestamos';
import { Socios } from './socios/socios';
import { Cuotas } from './cuotas/cuotas';
import { Actividades } from './actividades/actividades';
import { Nprestamo } from './nprestamo/nprestamo';


export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'inicioSesion', component: InicioSesion },
  { path: 'libros', component: Libros },
  { path: 'prestamos', component: Prestamos },
  { path: 'socios', component: Socios },
  { path: 'cuotas', component: Cuotas },
  { path: 'actividades', component: Actividades },
  { path: 'nprestamo', component: Nprestamo}
];
