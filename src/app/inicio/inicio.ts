
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';

import { Actividad, TipoActividad } from '../models/models/actividad';
import { Socio } from '../models/models/socio';
import { Prestamo } from '../models/models/prestamo';
import { ActividadServicio } from '../services/actividade-service';
import { SocioServicio } from '../services/socio';
import { PrestamoService } from '../services/prestamo';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, FormsModule],
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

  prestamosVencidos = 0;
  cuotasPendientes = 0;
  sociosActivos = 0;

  terminoBusquedaExpress = '';
  socioEncontrado: Socio | null = null;
  prestamoEncontrado: Prestamo | null = null;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private router: Router,
    private actividadServicio: ActividadServicio,
    private socioServicio: SocioServicio,
    private prestamoService: PrestamoService
  ) {}


  // ==========================================
  // AL INICIAR
  // ==========================================

  ngOnInit(): void {

    // Fecha
    this.actualizarFecha();

    this.intervalo = setInterval(() => {
      this.actualizarFecha();
      this.actualizarEstadisticas();
    }, 60000);


    // Obtener actividades
    this.obtenerActividades();
    this.actualizarEstadisticas();
  }



  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  actualizarEstadisticas(): void {

    const socios =
      this.socioServicio
        .tenerSocios();


    this.sociosActivos =
      socios.filter(
        socio =>
          socio.estado === 'activo'
      ).length;


    this.cuotasPendientes =
      socios.filter(
        socio =>
          socio.cuota === 'pendiente'
      ).length;


    const hoy =
      new Date()
        .toISOString()
        .split('T')[0];


    this.prestamosVencidos =
      this.prestamoService
        .obtenerPrestamos()
        .filter(
          prestamo =>
            prestamo.estado !== 'devuelto' &&
            (
              prestamo.estado === 'atrasado' ||
              prestamo.fechaVencimiento < hoy
            )
        ).length;

  }


  buscarExpress(): void {

    const termino =
      this.terminoBusquedaExpress
        .trim()
        .toLowerCase();


    if (!termino) {

      this.socioEncontrado = null;
      this.prestamoEncontrado = null;
      return;

    }


    this.socioEncontrado =
      this.socioServicio
        .tenerSocios()
        .find(
          socio =>
            socio.nombre
              .toLowerCase()
              .includes(termino) ||
            socio.dni
              .toLowerCase()
              .includes(termino) ||
            socio.numCarnet
              .toLowerCase()
              .includes(termino)
        ) ||
      null;


    this.prestamoEncontrado =
      this.socioEncontrado
        ? this.prestamoService
            .obtenerPrestamos()
            .find(
              prestamo =>
                prestamo.socioId ===
                this.socioEncontrado?.id &&
                prestamo.estado !== 'devuelto'
            ) || null
        : null;

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
