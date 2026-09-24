import { Injectable } from '@angular/core';

import {
  Cuota
} from '../models/models/cuota';

import {
  SocioServicio
} from './socio';

import {
  Socio
} from '../models/models/socio';


@Injectable({
  providedIn: 'root',
})
export class CuotasService {

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private socioServicio: SocioServicio
  ) {}


  // ==========================================
  // OBTENER CUOTAS
  // ==========================================

  obtenerCuotas(): Socio[] {

    return this.socioServicio
      .tenerSocios();

  }


  // ==========================================
  // COBRAR CUOTA
  // ==========================================

  cobrarCuota(
    idSocio: number | string
  ): void {

    this.socioServicio
      .actualizarEstadoCuota(
        idSocio,
        'pagada'
      );

  }


  // ==========================================
  // WHATSAPP
  // ==========================================

  enviarRecordatorioWhatsApp(
    socio: Socio
  ): void {

    const mensaje =
      `Hola ${socio.nombre}, ` +
      `te recordamos que tu cuota ` +
      `se encuentra en estado: ` +
      `${socio.cuota.toUpperCase()}.`;


    const url =
      `https://wa.me/${socio.telefono}` +
      `?text=${encodeURIComponent(mensaje)}`;


    window.open(
      url,
      '_blank'
    );

  }


  // ==========================================
  // DAR DE BAJA
  // ==========================================

  darDeBaja(
    id: number
  ): void {

    const confirmarBaja =
      confirm(
        '¿Estás seguro de que deseas ' +
        'dar de baja a este socio?'
      );


    if (confirmarBaja) {

      const socio =
        this.socioServicio
          .tenerSocios()
          .find(
            s =>
              s.id === id
          );


      if (socio) {

        socio.estado =
          'inactivo';


        const mensaje =
          `Hola ${socio.nombre}, ` +
          `le avisamos que su estado ` +
          `ha sido cambiado a "inactivo". ` +
          `Si desea reactivar su membresía, ` +
          `por favor póngase en contacto ` +
          `con nosotros.`;


        const url =
          `https://wa.me/${socio.telefono}` +
          `?text=${encodeURIComponent(mensaje)}`;


        window.open(
          url,
          '_blank'
        );

      }

    } else {

      alert(
        'Operación cancelada. ' +
        'El socio no ha sido dado de baja.'
      );

    }

  }

}