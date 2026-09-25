import {
  Injectable,
  inject
} from '@angular/core';

import {
  Prestamo
} from '../models/models/prestamo';

import {
  LibroService
} from './libro-service';


@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private libroService =
    inject(LibroService);


  private prestamos: Prestamo[] = [];


  // ==========================================
  // OBTENER PRÉSTAMOS
  // ==========================================

  obtenerPrestamos(): Prestamo[] {

    return this.prestamos;

  }


  // ==========================================
  // AGREGAR PRÉSTAMO
  // ==========================================

  agregarPrestamo(
    nuevoPrestamo: Prestamo & {
      libroId?: string
    }
  ): boolean {

    const libroId =
      nuevoPrestamo.libroId ||

      this.libroService.libros.find(
        l =>
          l.titulo
            .toLowerCase() ===
          nuevoPrestamo.libro
            .toLowerCase()
      )?.id ||

      '';


    // Modifica automáticamente
    // la copia física a 'Prestada'

    const exito =
      this.libroService.prestarCopia(
        libroId,
        nuevoPrestamo.inventario
      );


    if (exito) {

      this.prestamos.push(
        nuevoPrestamo
      );

      return true;

    }


    return false;

  }


  // ==========================================
  // DEVOLVER PRÉSTAMO
  // ==========================================

  devolverPrestamo(
    id: string
  ): void {

    const prestamo =
      this.prestamos.find(
        p =>
          p.id === id
      );


    if (prestamo) {

      prestamo.estado =
        'devuelto';


      // Devuelve automáticamente
      // la copia física a 'Disponible'

      this.libroService
        .devolverCopiaPorInventario(
          prestamo.inventario
        );

    }

  }


  // ==========================================
  // RENOVAR PRÉSTAMO
  // ==========================================

  renovarPrestamo(
    id: string
  ): void {

    const prestamo =
      this.prestamos.find(
        p =>
          p.id === id
      );


    if (prestamo) {

      prestamo.renovaciones += 1;


      const fechaActual =
        new Date(
          prestamo.fechaVencimiento
        );


      fechaActual.setMonth(
        fechaActual.getMonth() + 1
      );


      prestamo.fechaVencimiento =
        fechaActual
          .toISOString()
          .split('T')[0];

    }

  }


  // ==========================================
  // ACTUALIZAR DATOS DEL SOCIO
  // ==========================================

  actualizarDatosSocio(
    socioId: number,

    nombreAnterior: string,

    nuevoNombre: string

  ): void {

    this.prestamos.forEach(
      prestamo => {

        // Primero intentamos encontrar
        // el préstamo mediante el ID.

        if (
          prestamo.socioId ===
          socioId
        ) {

          prestamo.socio =
            nuevoNombre;

          return;

        }


        // Compatibilidad con préstamos
        // creados antes de agregar socioId.

        if (
          prestamo.socio
            .trim()
            .toLowerCase() ===

          nombreAnterior
            .trim()
            .toLowerCase()
        ) {

          prestamo.socioId =
            socioId;

          prestamo.socio =
            nuevoNombre;

        }

      }
    );

  }


  // ==========================================
  // SUSPENDER PRÉSTAMO
  // ==========================================

  suspenderPrestamo(
    id: string
  ): void {

    const p =
      this.prestamos.find(
        p =>
          p.id === id
      );


    if (
      p &&
      p.estado !== 'devuelto'
    ) {

      p.estado =
        'suspendido';

    }

  }


  // ==========================================
  // QUITAR SUSPENSIÓN
  // ==========================================

  quitarSuspension(
    id: string
  ): void {

    const p =
      this.prestamos.find(
        p =>
          p.id === id
      );


    if (
      p &&
      p.estado === 'suspendido'
    ) {

      const hoy =
        new Date()
          .toISOString()
          .split('T')[0];


      p.estado =
        p.fechaVencimiento < hoy
          ? 'atrasado'
          : 'activo';

    }

  }

}