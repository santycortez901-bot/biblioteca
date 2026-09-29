import { Injectable } from '@angular/core';
import { Actividad, TipoActividad } from '../models/models/actividad';

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
  ];

  obtenerActividades(): Actividad[] {
    return this.actividades;
  }

  agregarActividad(actividad: Actividad): void {
    this.actividades.unshift(actividad);
  }

  registrarActividad(
    tipo: TipoActividad,
    descripcion: string,
    idRelacionado?: string
  ): void {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = ahora.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    this.agregarActividad({
      tipo,
      descripcion,
      fecha: `${fecha} ${hora}`,
      user: 'admin',
      idrelacionado: idRelacionado
    });
  }
}