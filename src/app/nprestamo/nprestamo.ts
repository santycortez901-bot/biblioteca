import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Prestamo,
  PrestamoService
} from '../services/prestamo';

@Component({
  selector: 'app-nprestamo',
  imports: [FormsModule],
  templateUrl: './nprestamo.html',
  styleUrl: './nprestamo.css'
})
export class Nprestamo {

  @Output() cerrar = new EventEmitter<void>();


  // Datos del formulario

  socio: string = '';

  libro: string = '';

  inventario: string = '';

  fechaInicio: string = '';

  fechaVencimiento: string = '';


  constructor(
    private prestamoService: PrestamoService
  ) {

    // Fecha actual

    const hoy = new Date();


    // 30 días después

    const vencimiento = new Date(hoy);

    vencimiento.setDate(
      vencimiento.getDate() + 30
    );


    this.fechaInicio =
      this.formatearFecha(hoy);

    this.fechaVencimiento =
      this.formatearFecha(vencimiento);

  }


  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

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


  // ==========================================
  // CREAR PRÉSTAMO
  // ==========================================

  crearPrestamo(): void {

    if (
      !this.socio.trim() ||
      !this.libro.trim() ||
      !this.inventario.trim()
    ) {

      alert('Completá todos los campos.');

      return;

    }


    // Generar ID automáticamente

    const prestamos =
      this.prestamoService.obtenerPrestamos();


    const numero =
      prestamos.length + 1;


    const id =
      `PR${String(numero).padStart(3, '0')}`;


    // Convertir las fechas de YYYY-MM-DD
    // a DD/MM/YYYY para que coincidan
    // con tus préstamos actuales

    const fechaInicio =
      this.convertirFecha(this.fechaInicio);

    const fechaVencimiento =
      this.convertirFecha(this.fechaVencimiento);


    const nuevoPrestamo: Prestamo = {

      id: id,

      socio: this.socio.trim(),

      libro: this.libro.trim(),

      inventario: this.inventario.trim(),

      fechaInicio: fechaInicio,

      fechaVencimiento: fechaVencimiento,

      estado: 'activo',

      renovaciones: 0

    };


    // Guardar en el servicio

    this.prestamoService.agregarPrestamo(
      nuevoPrestamo
    );


    // Cerrar modal

    this.cerrar.emit();

  }


  // ==========================================
  // CONVERTIR FECHA
  // ==========================================

  private convertirFecha(fecha: string): string {

    const partes = fecha.split('-');


    if (partes.length !== 3) {
      return fecha;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }


  // ==========================================
  // CERRAR MODAL
  // ==========================================

  cerrarModal(): void {

    this.cerrar.emit();

  }

}