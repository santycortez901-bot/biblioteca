import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Nprestamo } from '../nprestamo/nprestamo';

import {
  Prestamo,
  PrestamoService
} from '../services/prestamo';

import { Socio } from '../models/models/socio';

import { SocioService } from '../services/socios-service';

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
    private prestamoService: PrestamoService,
    private socioService: SocioService
  ) {
    this.actualizarPrestamos();
  }

  actualizarPrestamos(): void {

    this.prestamos =
      this.prestamoService.obtenerPrestamos();

  }

  obtenerSocio(idSocio: string): Socio | undefined {

    return this.socioService.obtenerSocioPorId(
      idSocio
    );

  }

  get prestamosFiltrados(): Prestamo[] {

    const texto =
      this.busqueda.toLowerCase().trim();

    return this.prestamos.filter(prestamo => {

      const socio =
        this.obtenerSocio(prestamo.idSocio);

      const nombreSocio =
        socio?.nombre.toLowerCase() ?? '';

      const coincideBusqueda =
        prestamo.id
          .toLowerCase()
          .includes(texto)

        ||

        nombreSocio
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
        this.filtro === 'todos' ||
        prestamo.estado === this.filtro;

      return coincideBusqueda && coincideFiltro;

    });

  }

  cambiarFiltro(
    filtro:
      'todos' |
      'activo' |
      'vencido' |
      'devuelto'
  ): void {

    this.filtro = filtro;

  }

  renovarPrestamo(prestamo: Prestamo): void {

    this.prestamoService.renovarPrestamo(
      prestamo.id
    );

    this.actualizarPrestamos();

  }

  devolverPrestamo(prestamo: Prestamo): void {

    this.prestamoService.devolverPrestamo(
      prestamo.id
    );

    this.actualizarPrestamos();

  }

  abrirNuevoPrestamo(): void {

    this.mostrarNuevoPrestamo = true;

  }

  cerrarNuevoPrestamo(): void {

    this.mostrarNuevoPrestamo = false;

    this.actualizarPrestamos();

  }

}