import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Prestamo,
  PrestamoService
} from '../services/prestamo';

import { Socio } from '../models/models/socio';

import { SocioService } from '../services/socios-service';

@Component({
  selector: 'app-nprestamo',
  imports: [FormsModule],
  templateUrl: './nprestamo.html',
  styleUrl: './nprestamo.css'
})
export class Nprestamo {

  @Output() cerrar = new EventEmitter<void>();

  socios: Socio[] = [];

  idSocio: string = '';

  libro: string = '';

  inventario: string = '';

  fechaInicio: string = '';

  fechaVencimiento: string = '';

  constructor(
    private prestamoService: PrestamoService,
    private socioService: SocioService
  ) {

    this.socios =
      this.socioService.obtenerSocios();

    const hoy = new Date();

    const vencimiento = new Date(hoy);

    vencimiento.setDate(
      vencimiento.getDate() + 30
    );

    this.fechaInicio =
      this.formatearFecha(hoy);

    this.fechaVencimiento =
      this.formatearFecha(vencimiento);

  }

  private formatearFecha(fecha: Date): string {

    const año = fecha.getFullYear();

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      fecha.getDate()
    ).padStart(2, '0');

    return `${año}-${mes}-${dia}`;

  }

  crearPrestamo(): void {

    if (
      !this.idSocio ||
      !this.libro.trim() ||
      !this.inventario.trim()
    ) {

      alert('Completá todos los campos.');

      return;

    }

    const prestamos =
      this.prestamoService.obtenerPrestamos();

    const numero =
      prestamos.length + 1;

    const id =
      `PR${String(numero).padStart(3, '0')}`;

    const fechaInicio =
      this.convertirFecha(this.fechaInicio);

    const fechaVencimiento =
      this.convertirFecha(this.fechaVencimiento);

    const nuevoPrestamo: Prestamo = {

      id: id,

      idSocio: this.idSocio,

      libro: this.libro.trim(),

      inventario: this.inventario.trim(),

      fechaInicio: fechaInicio,

      fechaVencimiento: fechaVencimiento,

      estado: 'activo',

      renovaciones: 0

    };

    this.prestamoService.agregarPrestamo(
      nuevoPrestamo
    );

    this.cerrar.emit();

  }

  private convertirFecha(fecha: string): string {

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }

  cerrarModal(): void {

    this.cerrar.emit();

  }

}