import { Injectable } from '@angular/core';
import { Socio } from '../models/models/socio';

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
      numCarnet: `c-${idSecuencia}`
    };

    this.socios.push(nuevoSocio);

    this.contadorSocio++;
  }

  actualizarEstadoPrestamo(
    idSocio: number | string,
    nuevoEstado: 'Libre' | 'Encurso'
  ): void {

    const socio = this.socios.find(
      s => s.id === Number(idSocio)
    );

    if (socio) {
      socio.prestamos = nuevoEstado;
    }
  }

  actualizarEstadoSocio(
    idSocio: number | string,
    nuevoEstado:
      | 'activo'
      | 'inactivo'
      | 'suspendido'
      | 'bloqueado'
  ): void {

    const socio = this.socios.find(
      s => s.id === Number(idSocio)
    );

    if (socio) {
      socio.estado = nuevoEstado;
    }
  }
}