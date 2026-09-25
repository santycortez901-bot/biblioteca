import { Injectable } from '@angular/core';

import {
  Socio,
  EstadoSocio,
  EstadoCuota,
  PrestamoActual
} from '../models/models/socio';


@Injectable({
  providedIn: 'root',
})
export class SocioServicio {

  private socios: Socio[] = [];

  private contadorSocio = 1;


  constructor() {

    this.cargarSociosDePrueba();

  }


  // ==========================================
  // SOCIOS DE PRUEBA
  // ==========================================

  private cargarSociosDePrueba(): void {

    const sociosDePrueba:
      Omit<Socio, 'id' | 'numCarnet'>[] = [

      {
        nombre: 'Ana Martínez',
        edad: 28,
        dni: '30111222',
        telefono: '+549111111111',
        email: 'ana.martinez@gmail.com',
        estado: 'activo',
        cuota: 'pagada',
        prestamos: 'Libre'
      },

      {
        nombre: 'Bruno Fernández',
        edad: 35,
        dni: '30222333',
        telefono: '+549222222222',
        email: 'bruno.fernandez@gmail.com',
        estado: 'activo',
        cuota: 'pendiente',
        prestamos: 'En curso'
      },

      {
        nombre: 'Carla Gómez',
        edad: 22,
        dni: '30333444',
        telefono: '+549333333333',
        email: 'carla.gomez@gmail.com',
        estado: 'suspendido',
        cuota: 'pendiente',
        prestamos: 'En curso'
      },

      {
        nombre: 'Diego Rodríguez',
        edad: 41,
        dni: '30444555',
        telefono: '+549444444444',
        email: 'diego.rodriguez@gmail.com',
        estado: 'inactivo',
        cuota: 'vencida',
        prestamos: 'Libre'
      },

      {
        nombre: 'Elena López',
        edad: 17,
        dni: '30555666',
        telefono: '+549555555555',
        email: 'elena.lopez@gmail.com',
        estado: 'activo',
        cuota: 'vencida',
        prestamos: 'Libre'
      },

      {
        nombre: 'Florencia Silva',
        edad: 19,
        dni: '30666777',
        telefono: '+549666666666',
        email: 'florencia.silva@gmail.com',
        estado: 'inactivo',
        cuota: 'pagada',
        prestamos: 'Libre'
      }

    ];


    sociosDePrueba.forEach(
      socio =>
        this.agregarSocio(socio)
    );

  }


  // ==========================================
  // OBTENER SOCIOS
  // ==========================================

  tenerSocios(): Socio[] {

    return this.socios;

  }


  // ==========================================
  // AGREGAR SOCIO
  // ==========================================

  agregarSocio(
    socioData: Omit<Socio, 'id' | 'numCarnet'>
  ): void {

    const idSecuencia =
      this.contadorSocio
        .toString()
        .padStart(3, '0');


    const nuevoSocio: Socio = {

      ...socioData,

      id: this.contadorSocio,

      numCarnet: `c-${idSecuencia}`,

    };


    this.socios.push(
      nuevoSocio
    );


    this.contadorSocio++;

  }


  // ==========================================
  // ACTUALIZAR SOCIO
  // ==========================================

  actualizarSocio(
    socioActualizado: Socio
  ): void {

    const index =
      this.socios.findIndex(
        s =>
          s.id ===
          socioActualizado.id
      );


    if (index !== -1) {

      this.socios[index] = {

        ...socioActualizado

      };

    }

  }


  // ==========================================
  // MODIFICAR SOCIO
  // ==========================================

  modificarSocio(
    socioActualizado: Socio
  ): void {

    this.actualizarSocio(
      socioActualizado
    );

  }


  // ==========================================
  // ACTUALIZAR ESTADO PRÉSTAMO
  // ==========================================

  actualizarEstadoPrestamo(
    idSocio: number | string,

    nuevoEstado: PrestamoActual
  ): void {

    const socio =
      this.socios.find(
        s =>
          s.id ===
          Number(idSocio)
      );


    if (socio) {

      socio.prestamos =
        nuevoEstado;

    }

  }


  // ==========================================
  // ACTUALIZAR ESTADO DEL SOCIO
  // ==========================================

  actualizarEstadoSocio(
    idSocio: number | string,

    nuevoEstado: EstadoSocio
  ): void {

    const socio =
      this.socios.find(
        s =>
          s.id ===
          Number(idSocio)
      );


    if (socio) {

      socio.estado =
        nuevoEstado;

    }

  }


  // ==========================================
  // ACTUALIZAR ESTADO CUOTA
  // ==========================================

  actualizarEstadoCuota(
    idSocio: number | string,

    nuevoEstado: EstadoCuota
  ): void {

    const socio =
      this.socios.find(
        s =>
          s.id ===
          Number(idSocio)
      );


    if (socio) {

      socio.cuota =
        nuevoEstado;

    }

  }

}