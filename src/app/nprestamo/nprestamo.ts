import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import {
  Prestamo,
  PrestamoService
} from '../services/prestamo';

import { Socio } from '../models/models/socio';

import { SocioServicio } from '../services/socio';

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
    private socioService: SocioServicio
  ) {

    this.socios =
      this.socioService.tenerSocios();

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
    // 1. Validación de campos requeridos
    if (
      !this.idSocio ||
      !this.libro.trim() ||
      !this.inventario.trim() ||
      !this.fechaInicio ||
      !this.fechaVencimiento
    ) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, completá todos los campos del formulario.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    // 2. Generación del ID y armado del objeto
    const prestamos = this.prestamoService.obtenerPrestamos();
    const numero = prestamos.length + 1;
    const id = `PR${String(numero).padStart(3, '0')}`;

    const fechaInicio = this.convertirFecha(this.fechaInicio);
    const fechaVencimiento = this.convertirFecha(this.fechaVencimiento);

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

    // 3. Guardado del préstamo y actualización del socio
    this.prestamoService.agregarPrestamo(nuevoPrestamo);
    this.socioService.actualizarEstadoPrestamo(this.idSocio, 'Encurso');

    // 4. Cartel de éxito y cierre del modal
    Swal.fire({
      title: '¡Prestamo Creado!',
      text: 'Se creó un nuevo préstamo con éxito.',
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.cerrar.emit();
    });
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