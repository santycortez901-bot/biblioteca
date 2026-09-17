import { Injectable, inject } from '@angular/core';
import { Prestamo } from '../models/models/prestamo';
import { LibroService } from './libro-service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private libroService = inject(LibroService);
  private prestamos: Prestamo[] = [];

  obtenerPrestamos(): Prestamo[] {
    return this.prestamos;
  }

  agregarPrestamo(nuevoPrestamo: Prestamo & { libroId?: string }): boolean {
    const libroId = nuevoPrestamo.libroId || this.libroService.libros.find(
      l => l.titulo.toLowerCase() === nuevoPrestamo.libro.toLowerCase()
    )?.id || '';

    // Modifica automáticamente la copia física a 'Prestada'
    const exito = this.libroService.prestarCopia(libroId, nuevoPrestamo.inventario);
    
    if (exito) {
      this.prestamos.push(nuevoPrestamo);
      return true;
    }
    return false;
  }

  devolverPrestamo(id: string): void {
    const prestamo = this.prestamos.find(p => p.id === id);
    if (prestamo) {
      prestamo.estado = 'devuelto';
      // Devuelve automáticamente la copia física a 'Disponible'
      this.libroService.devolverCopiaPorInventario(prestamo.inventario);
    }
  }

  renovarPrestamo(id: string): void {
    const prestamo = this.prestamos.find(p => p.id === id);
    if (prestamo) {
      prestamo.renovaciones += 1;
      const fechaActual = new Date(prestamo.fechaVencimiento);
      fechaActual.setDate(fechaActual.getDate() + 7);
      prestamo.fechaVencimiento = fechaActual.toISOString().split('T')[0];
    }
  }
}