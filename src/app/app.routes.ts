import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { InicioSesion } from './inicio-sesion/inicio-sesion';
import { Libros } from './libros/libros';
import { Prestamos } from './prestamos/prestamos';
import { Socios } from './socios/socios';
import { Footer } from './footer/footer';
import { Nav } from './nav/nav';

export const routes: Routes = [
    {path:'',redirectTo: 'inicio', pathMatch: 'full' },
    {path:'inicio', component: Inicio},
    {path:'inicioSesion', component: InicioSesion},
    {path:'libros', component: Libros},
    {path:'prestamos', component: Prestamos},
    {path:'socios', component: Socios},
    {path:'footer', component: Footer},
    {path:'nav', component: Nav},


];
