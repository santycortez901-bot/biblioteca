import { Injectable } from '@angular/core';
import { Cuota } from '../models/models/cuota';

@Injectable({
  providedIn: 'root',
})
export class CuotasService {
  // Lista de datos iniciales (Hardcoded)
  private cuotas: Cuota[] = [
    { id: 'SOC-001', nombreSocio: 'Nacho Maldonado', dni: '40123456', estado: 'pendiente', numSocio: 5491123456789 },
    { id: 'SOC-002', nombreSocio: 'María Belén Gómez', dni: '38987654', estado: 'pagada', numSocio: 5491198765432 },
    { id: 'SOC-003', nombreSocio: 'Lucas Fernández', dni: '41555666', estado: 'vencida', numSocio: 5491155554444 },
    { id: 'SOC-004', nombreSocio: 'Sofia Rodríguez', dni: '39222333', estado: 'vencida', numSocio: 5491133332222 },
    { id: 'SOC-005', nombreSocio: 'Gonzalo Pérez', dni: '42888999', estado: 'pendiente', numSocio: 5491144448888 },
    { id: 'SOC-006', nombreSocio: 'Valentina Martínez', dni: '37444111', estado: 'vencida', numSocio: 5491177771111 }
  ];

  constructor() {}

  // Obtener todas las cuotas
  getCuotas(): Cuota[] {
    return [...this.cuotas];
  }

  // Funcionalidad Botón "Cobrar": Cambia el estado a 'pagada'
  cobrarCuota(id: string): void {
    this.cuotas = this.cuotas.map(cuota => {
      if (cuota.id === id) {
        return { ...cuota, estado: 'pagada' };
      }
      return cuota;
    });
  }

  // Funcionalidad Botón Recordatorio: Abre un chat de WhatsApp con un mensaje automático
  enviarRecordatorioWhatsApp(cuota: Cuota): void {
    const mensaje = `Hola ${cuota.nombreSocio}, te recordamos que tu cuota se encuentra en estado: ${cuota.estado.toUpperCase()}.`;
    const url = `https://wa.me{cuota.numSocio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}
