import { Injectable } from '@angular/core';
import { Cuota } from '../models/models/cuota';
import { SocioServicio } from './socio';
import { Socio } from '../models/models/socio';

@Injectable({
  providedIn: 'root',
})
export class CuotasService {
   // Inyectamos el servicio de socios para poder usar sus funciones
  constructor(private socioServicio: SocioServicio) {}

  // Las cuotas ahora son directamente la lista de socios que tiene el SocioServicio
  obtenerCuotas(): Socio[] {
    return this.socioServicio.tenerSocios();
  }

  // Llama a la función del SocioServicio para cambiar el estado a 'pagada'
  cobrarCuota(idSocio: number | string): void {
    this.socioServicio.actualizarEstadoCuota(idSocio, 'pagada');
  }

  // Envía el recordatorio usando las propiedades unificadas del socio
  enviarRecordatorioWhatsApp(socio: Socio): void {
    const mensaje = `Hola ${socio.nombre}, te recordamos que tu cuota se encuentra en estado: ${socio.cuota.toUpperCase()}.`;
    const url = `https://wa.me{socio.numSocio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}
