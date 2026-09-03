import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Nprestamo } from '../nprestamo/nprestamo';

import {Prestamo, PrestamoService } from '../services/prestamo';
@Component({
  selector: 'app-prestamos',
  imports: [
    FormsModule,
    Nprestamo
  ],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos {

  prestamos: Prestamo[] = [];

  busqueda: string = '';

  filtro:
    'todos' |
    'activo' |
    'vencido' |
    'devuelto' = 'todos';

  mostrarNuevoPrestamo = false;


  constructor(
    private prestamoService: PrestamoService
  ) {

    this.actualizarPrestamos();

  }


  // ==========================================
  // ACTUALIZAR LISTA
  // ==========================================

  actualizarPrestamos(): void {

    this.prestamos =
      this.prestamoService.obtenerPrestamos();

  }


  // ==========================================
  // FILTRAR
  // ==========================================

  get prestamosFiltrados(): Prestamo[] {

    const texto =
      this.busqueda.toLowerCase().trim();


    return this.prestamos.filter(prestamo => {

      const coincideBusqueda =

        prestamo.id
          .toLowerCase()
          .includes(texto)

        ||

        prestamo.socio
          .toLowerCase()
          .includes(texto)

        ||

        prestamo.libro
          .toLowerCase()
          .includes(texto)

        ||

        prestamo.inventario
          .toLowerCase()
          .includes(texto);


      const coincideFiltro =

        this.filtro === 'todos'

        ||

        prestamo.estado === this.filtro;


      return coincideBusqueda && coincideFiltro;

    });

  }


  // ==========================================
  // CAMBIAR FILTRO
  // ==========================================

  cambiarFiltro(
    filtro:
      'todos' |
      'activo' |
      'vencido' |
      'devuelto'
  ): void {

    this.filtro = filtro;

  }


  // ==========================================
  // RENOVAR
  // ==========================================

  renovarPrestamo(prestamo: Prestamo): void {

    this.prestamoService.renovarPrestamo(
      prestamo.id
    );

    this.actualizarPrestamos();

  }


  // ==========================================
  // DEVOLVER
  // ==========================================

  devolverPrestamo(prestamo: Prestamo): void {

    this.prestamoService.devolverPrestamo(
      prestamo.id
    );

    this.actualizarPrestamos();

  }


  // ==========================================
  // NUEVO PRÉSTAMO
  // ==========================================

  abrirNuevoPrestamo(): void {

    this.mostrarNuevoPrestamo = true;

  }


  cerrarNuevoPrestamo(): void {

    this.mostrarNuevoPrestamo = false;

    this.actualizarPrestamos();

  }

}