import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio } from '../models/models/socio';
import { SocioServicio } from './socio';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {
  constructor(private socioServicio: SocioServicio) {}

  obtenerCuotas(): Socio[] {
    return this.socioServicio.tenerSocios();
  }

  cargarCuotas(): Observable<Socio[]> {
    return this.socioServicio.cargarSocios();
  }

  cobrarCuota(idSocio: number | string): Observable<void> {
    return this.socioServicio.actualizarEstadoCuota(idSocio, 'pagada');
  }

  enviarRecordatorioWhatsApp(socio: Socio): void {
    const mensaje = `Hola ${socio.nombre}, te recordamos que tu cuota se encuentra en estado: ${socio.cuota.toUpperCase()}.`;
    const url = `https://wa.me/${socio.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  notificarCambioEstado(socio: Socio, estado: 'activo' | 'inactivo'): void {
    const mensaje = estado === 'inactivo'
      ? `Hola ${socio.nombre}, le avisamos que su estado ha cambiado a "inactivo".`
      : `Hola ${socio.nombre}, le avisamos que su membresía volvió a estar activa.`;
    const url = `https://wa.me/${socio.telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  darDeBaja(id: number): Observable<void> {
    return this.socioServicio.actualizarEstadoSocio(id, 'inactivo');
  }

  darDeAlta(id: number): Observable<void> {
    return this.socioServicio.actualizarEstadoSocio(id, 'activo');
  }
}
