
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';

import { Actividad, TipoActividad } from '../models/models/actividad';
import { ActividadServicio } from '../services/actividade-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {

  // ==========================================
  // FECHA ACTUAL
  // ==========================================

  fechaActual: string = '';

  private intervalo: any;


  // ==========================================
  // ACTIVIDADES
  // ==========================================

  actividadesRecientes: Actividad[] = [];


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private router: Router,
    private actividadServicio: ActividadServicio
  ) {}


  // ==========================================
  // AL INICIAR
  // ==========================================

  ngOnInit(): void {

    // Fecha
    this.actualizarFecha();

    this.intervalo = setInterval(() => {
      this.actualizarFecha();
    }, 60000);


    // Obtener actividades
    this.obtenerActividades();
  }


  // ==========================================
  // OBTENER ACTIVIDADES
  // ==========================================

  obtenerActividades(): void {

    const actividades =
      this.actividadServicio.obtenerActividades();

    // Mostrar solamente las 4 más recientes
    this.actividadesRecientes =
      actividades.slice(0, 4);

  }


  // ==========================================
  // FECHA ACTUAL
  // ==========================================

  actualizarFecha(): void {

    const ahora = new Date();

    this.fechaActual =
      ahora.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  }


  // ==========================================
  // DESTRUIR COMPONENTE
  // ==========================================

  ngOnDestroy(): void {

    clearInterval(this.intervalo);

  }


  // ==========================================
  // NUEVO PRÉSTAMO
  // ==========================================

  abrirNuevoPrestamo(): void {

    this.router.navigate(['/prestamos'], {
      queryParams: {
        mostrarNuevoPrestamo: 'true'
      }
    });

  }


  // ==========================================
  // CARGAR SOCIO
  // ==========================================

  cargarSocio(): void {

    this.router.navigate(['/socios'], {
      queryParams: {
        openModal: 'true'
      }
    });

  }

}
