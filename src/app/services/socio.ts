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

  private cargarSociosDePrueba(): void {
    const sociosDePrueba: Omit<Socio, 'id' | 'numCarnet'>[] = [
      {
        nombre: 'Lucía Fernández', edad: 26, dni: '32145678',
        telefono: '+5491123456789', email: 'lucia.fernandez@gmail.com',
        estado: 'activo', cuota: 'pagada', prestamos: 'Libre'
      },
      {
        nombre: 'Martín González', edad: 34, dni: '29876543',
        telefono: '+5491134567890', email: 'martin.gonzalez@gmail.com',
        estado: 'activo', cuota: 'pendiente', prestamos: 'Libre'
      },
      {
        nombre: 'Sofía Ramírez', edad: 21, dni: '33456789',
        telefono: '+5491145678901', email: 'sofia.ramirez@hotmail.com',
        estado: 'activo', cuota: 'pagada', prestamos: 'En curso'
      },
      {
        nombre: 'Tomás Herrera', edad: 42, dni: '27654321',
        telefono: '+5491156789012', email: 'tomas.herrera@gmail.com',
        estado: 'suspendido', cuota: 'pendiente', prestamos: 'Libre'
      },
      {
        nombre: 'Valentina Castro', edad: 29, dni: '31234567',
        telefono: '+5491167890123', email: 'valentina.castro@gmail.com',
        estado: 'activo', cuota: 'pendiente', prestamos: 'Libre'
      },
      {
        nombre: 'Julián Morales', edad: 37, dni: '28987654',
        telefono: '+5491178901234', email: 'julian.morales@hotmail.com',
        estado: 'inactivo', cuota: 'vencida', prestamos: 'Libre'
      },
      {
        nombre: 'Camila Navarro', edad: 19, dni: '34567890',
        telefono: '+5491189012345', email: 'camila.navarro@gmail.com',
        estado: 'activo', cuota: 'pagada', prestamos: 'Libre'
      },
      {
        nombre: 'Federico Ortiz', edad: 31, dni: '30123456',
        telefono: '+5491190123456', email: 'federico.ortiz@gmail.com',
        estado: 'activo', cuota: 'pendiente', prestamos: 'En curso'
      },
      {
        nombre: 'Marina Acosta', edad: 48, dni: '25876543',
        telefono: '+5491101234567', email: 'marina.acosta@hotmail.com',
        estado: 'inactivo', cuota: 'pagada', prestamos: 'Libre'
      },
      {
        nombre: 'Nicolás Vera', edad: 16, dni: '35678901',
        telefono: '+5491112345678', email: 'nicolas.vera@gmail.com',
        estado: 'activo', cuota: 'pagada', prestamos: 'Libre'
      }
    ];

    sociosDePrueba.forEach(socio => this.agregarSocio(socio));
  }


  // ==========================================
  // OBTENER SOCIOS
  // ==========================================

  tenerSocios(): Socio[] {

    return [...this.socios];

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


    this.socios = [
      ...this.socios,
      nuevoSocio
    ];


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

      this.socios = this.socios.map(
        s =>
          s.id === socioActualizado.id
            ? { ...socioActualizado }
            : s
      );

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

      this.socios = this.socios.map(
        s =>
          s.id === Number(idSocio)
            ? { ...s, estado: nuevoEstado }
            : s
      );

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

      this.socios = this.socios.map(
        s =>
          s.id === Number(idSocio)
            ? { ...s, cuota: nuevoEstado }
            : s
      );

    }

  }

}