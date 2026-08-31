import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoPrestamo = 'activo' | 'vencido' | 'devuelto';

interface Prestamo {
  id: string;
  socio: string;
  libro: string;
  inventario: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPrestamo;
  renovaciones: number;
}

@Component({
  selector: 'app-prestamos',
  imports: [FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos {

  prestamos: Prestamo[] = [
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


  busqueda: string = '';

  filtro: 'todos' | 'activo' | 'vencido' | 'devuelto' = 'todos';


  get prestamosFiltrados(): Prestamo[] {

    const texto = this.busqueda.toLowerCase().trim();

    return this.prestamos.filter(prestamo => {

      const coincideBusqueda =
        prestamo.id.toLowerCase().includes(texto) ||
        prestamo.socio.toLowerCase().includes(texto) ||
        prestamo.libro.toLowerCase().includes(texto) ||
        prestamo.inventario.toLowerCase().includes(texto);

      const coincideFiltro =
        this.filtro === 'todos' ||
        prestamo.estado === this.filtro;

      return coincideBusqueda && coincideFiltro;
    });
  }


  cambiarFiltro(
    filtro: 'todos' | 'activo' | 'vencido' | 'devuelto'
  ): void {

    this.filtro = filtro;
  }


  renovarPrestamo(prestamo: Prestamo): void {

    if (prestamo.renovaciones >= 2) {
      return;
    }

    prestamo.renovaciones++;

  }


  devolverPrestamo(prestamo: Prestamo): void {

    prestamo.estado = 'devuelto';

  }


  nuevoPrestamo(): void {

    console.log('Nuevo préstamo');

  }

}