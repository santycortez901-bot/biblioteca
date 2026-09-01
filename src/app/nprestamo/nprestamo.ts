import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuevo-prestamo',
  imports: [FormsModule],
  templateUrl: './nuevo-prestamo.html',
  styleUrl: './nuevo-prestamo.css'
})
export class NuevoPrestamo {

  socio: string = '';
  libro: string = '';

  fechaInicio: string = '';
  fechaVencimiento: string = '';

  constructor() {
    this.calcularFechas();
  }


  calcularFechas(): void {

    const hoy = new Date();

    this.fechaInicio = this.formatearFecha(hoy);

    const vencimiento = new Date(hoy);

    vencimiento.setDate(vencimiento.getDate() + 30);

    this.fechaVencimiento = this.formatearFecha(vencimiento);
  }


  private formatearFecha(fecha: Date): string {

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
  }


  crearPrestamo(): void {

    const nuevoPrestamo = {
      socio: this.socio,
      libro: this.libro,
      fechaInicio: this.fechaInicio,
      fechaVencimiento: this.fechaVencimiento,
      estado: 'activo',
      renovaciones: 0
    };

    console.log('Nuevo préstamo:', nuevoPrestamo);
  }

}