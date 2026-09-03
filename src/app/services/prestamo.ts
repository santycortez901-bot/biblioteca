import { Injectable } from '@angular/core';

export type EstadoPrestamo = 'activo' | 'vencido' | 'devuelto';

export interface Prestamo {
  id: string;
  socio: string;
  libro: string;
  inventario: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPrestamo;
  renovaciones: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private prestamos: Prestamo[] = [

    {
      id: 'PR001',
      socio: 'María González',
      libro: 'Cien años de soledad',
      inventario: 'INV001',
      fechaInicio: '01/08/2026',
      fechaVencimiento: '31/08/2026',
      estado: 'activo',
      renovaciones: 0
    },

    {
      id: 'PR002',
      socio: 'Carlos Rodríguez',
      libro: '1984',
      inventario: 'INV003',
      fechaInicio: '20/06/2026',
      fechaVencimiento: '20/07/2026',
      estado: 'vencido',
      renovaciones: 1
    },

    {
      id: 'PR003',
      socio: 'Laura Fernández',
      libro: 'Don Quijote de la Mancha',
      inventario: 'INV004',
      fechaInicio: '05/08/2026',
      fechaVencimiento: '04/09/2026',
      estado: 'activo',
      renovaciones: 1
    },

    {
      id: 'PR004',
      socio: 'Diego Sánchez',
      libro: 'La sombra del viento',
      inventario: 'INV005',
      fechaInicio: '10/07/2026',
      fechaVencimiento: '09/08/2026',
      estado: 'vencido',
      renovaciones: 2
    },

    {
      id: 'PR005',
      socio: 'Florencia Morales',
      libro: 'Rayuela',
      inventario: 'INV006',
      fechaInicio: '12/08/2026',
      fechaVencimiento: '11/09/2026',
      estado: 'activo',
      renovaciones: 0
    }

  ];


  obtenerPrestamos(): Prestamo[] {
    return this.prestamos;
  }


  agregarPrestamo(prestamo: Prestamo): void {
    this.prestamos.push(prestamo);
  }


  renovarPrestamo(id: string): void {

    const prestamo = this.prestamos.find(
      prestamo => prestamo.id === id
    );

    if (!prestamo) {
      return;
    }

    if (prestamo.renovaciones >= 2) {
      return;
    }

    prestamo.renovaciones++;
  }


  devolverPrestamo(id: string): void {

    const prestamo = this.prestamos.find(
      prestamo => prestamo.id === id
    );

    if (!prestamo) {
      return;
    }

    prestamo.estado = 'devuelto';
  }

}