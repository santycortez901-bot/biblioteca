import { Injectable } from '@angular/core';
import { Prestamo } from '../models/models/prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private prestamos: Prestamo[] = [];

  constructor() {}

  obtenerPrestamos(): Prestamo[] {
    return this.prestamos;
  }

  agregarPrestamo(nuevoPrestamo: Prestamo): void {
    this.prestamos.push(nuevoPrestamo);
  }

  devolverPrestamo(id: string): void {
    const prestamo = this.prestamos.find(p => p.id === id);

    if (prestamo) {
      prestamo.estado = 'devuelto';
    }
  }

  renovarPrestamo(id: string): void {
    const prestamo = this.prestamos.find(p => p.id === id);

    if (prestamo && prestamo.renovaciones < 2) {

      prestamo.renovaciones += 1;

      const fechaActual = new Date(prestamo.fechaVencimiento);

      fechaActual.setDate(fechaActual.getDate() + 7);

      prestamo.fechaVencimiento =
        fechaActual.toISOString().split('T')[0];
    }
  }

  suspenderPrestamo(id: string, motivo: string): void {
    const prestamo = this.prestamos.find(p => p.id === id);

    if (prestamo) {
      prestamo.estado = 'suspendido';
      prestamo.motivoSuspension = motivo;
    }
  }
}