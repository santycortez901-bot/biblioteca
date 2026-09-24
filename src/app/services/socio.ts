import { Injectable } from '@angular/core';

import {
  Socio,
  EstadoCuota,
  PrestamoActual
} from '../models/models/socio';

@Injectable({
  providedIn: 'root',
})
export class SocioServicio {

  private socios: Socio[] = [];
  private contadorSocio = 1;

  tenerSocios(): Socio[] {
    return this.socios;
  }

  agregarSocio(
    socioData: Omit<Socio, 'id' | 'numCarnet'>
  ): void {

    const idSecuencia = this.contadorSocio
      .toString()
      .padStart(3, '0');

    const nuevoSocio: Socio = {
      ...socioData,
      id: this.contadorSocio,
      numCarnet: `c-${idSecuencia}`,
    };

    this.socios.push(nuevoSocio);

    this.contadorSocio++;
  }

  actualizarSocio(socioActualizado: Socio): void {

    const index = this.socios.findIndex(
      s => s.id === socioActualizado.id
    );

    if (index !== -1) {
      this.socios[index] = {
        ...socioActualizado
      };
    }
  }

  modificarSocio(socioActualizado: Socio): void {
    this.actualizarSocio(socioActualizado);
  }

  actualizarEstadoPrestamo(
    idSocio: number | string,
    nuevoEstado: PrestamoActual
  ): void {

    const socio = this.socios.find(
      s => s.id === Number(idSocio)
    );

    if (socio) {
      socio.prestamos = nuevoEstado;
    }
  }

  actualizarEstadoCuota(
    idSocio: number | string,
    nuevoEstado: EstadoCuota
  ): void {

    const socio = this.socios.find(
      s => s.id === Number(idSocio)
    );

    if (socio) {
      socio.cuota = nuevoEstado;
    }
  }
}