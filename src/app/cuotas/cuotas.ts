import { Component } from '@angular/core';
import {Cuota} from  '../models/models/cuota';

@Component({
  selector: 'app-cuotas',
  imports: [],
  templateUrl: './cuotas.html', 
  styleUrl: './cuotas.css',
})
export class Cuotas {
  cuotas: Cuota[] = [
  {
    id: 'SOC-001',
    nombreSocio: 'Nacho Maldonado',
    dni: '40123456',
    estado: 'pendiente',
    numSocio: 5491123456789
  },
  {
    id: 'SOC-002',
    nombreSocio: 'María Belén Gómez',
    dni: '38987654',
    estado: 'pagada',
    numSocio: 5491198765432
  },
  {
    id: 'SOC-003',
    nombreSocio: 'Lucas Fernández',
    dni: '41555666',
    estado: 'vencida',
    numSocio: 5491155554444
  },
  {
    id: 'SOC-004',
    nombreSocio: 'Sofia Rodríguez',
    dni: '39222333',
    estado: 'vencida',
    numSocio: 5491133332222
  },
  {
    id: 'SOC-005',
    nombreSocio: 'Gonzalo Pérez',
    dni: '42888999',
    estado: 'pendiente',
    numSocio: 5491144448888
  },
  {
    id: 'SOC-006',
    nombreSocio: 'Valentina Martínez',
    dni: '37444111',
    estado: 'vencida',
    numSocio: 5491177771111
  }
];
filtroActivo: string = 'todos';
// Cambia el filtro actual
  filtrarPorEstado(estado: string): void {
    this.filtroActivo = estado;
  }

  // Devuelve el arreglo filtrado para el @for del HTML
  get cuotasFiltradas(): Cuota[] {
    switch (this.filtroActivo) {
      case 'pagada':
        return this.cuotas.filter(cuota => cuota.estado === 'pagada');
      case 'pendiente':
        return this.cuotas.filter(cuota => cuota.estado === 'pendiente');
      case 'vencida':
        return this.cuotas.filter(cuota => cuota.estado === 'vencida');
      case 'todos':
      default:
        return this.cuotas;
    }
  }
}
