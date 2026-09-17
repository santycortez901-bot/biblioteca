import { Injectable } from '@angular/core';
import { Actividad } from '../models/models/actividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadServicio {

  private actividades: Actividad[] = [
    {
      tipo: 'login',
      descripcion: 'Inicio de sesión del sistema',
      fecha: '28/08/2026 12:00',
      user: 'admin'
    },
    {
      tipo: 'login',
      descripcion: 'Inicio de sesión del sistema',
      fecha: '19/08/2026 10:30',
      user: 'admin'
    },
    {
      tipo: 'prestamo',
      descripcion: 'Nuevo préstamo: Rayuela → Florencia Morales',
      fecha: '19/08/2026 09:15',
      user: 'admin',
      idrelacionado: 'PR005'
    },
    {
      tipo: 'cuota',
      descripcion: 'Cuota cobrada: María González — Julio 2026 ($1.200)',
      fecha: '18/08/2026 16:20',
      user: 'admin',
      idrelacionado: 'S001'
    },
    {
      tipo: 'socio',
      descripcion: 'Nuevo socio registrado: Pablo Torres (CAR010)',
      fecha: '18/08/2026 14:45',
      user: 'admin',
      idrelacionado: 'S010'
    },
    {
      tipo: 'libro',
      descripcion: 'Nuevo libro registrado: Cien años de soledad',
      fecha: '17/08/2026 11:30',
      user: 'admin',
      idrelacionado: 'L001'
    },
    {
      tipo: 'eliminacion',
      descripcion: 'Libro eliminado: Don Quijote de la Mancha',
      fecha: '16/08/2026 10:15',
      user: 'admin',
      idrelacionado: 'L002'
    },
    {
      tipo: 'edicion',
      descripcion: 'Libro editado: El Principito',
      fecha: '15/08/2026 16:40',
      user: 'admin',
      idrelacionado: 'L003'
    }
  ];

  obtenerActividades(): Actividad[] {
    return this.actividades;
  }

  agregarActividad(actividad: Actividad): void {
    this.actividades.unshift(actividad);
  }
}