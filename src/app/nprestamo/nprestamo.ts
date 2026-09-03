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


  // ==========================================
  // LISTA DE SOCIOS
  // ==========================================

  socios: Socio[] = [];


  // ==========================================
  // SOCIO SELECCIONADO
  // ==========================================

  idSocio: string = '';


  // ==========================================
  // DATOS DEL FORMULARIO
  // ==========================================

  libro: string = '';

  inventario: string = '';

  fechaInicio: string = '';

  fechaVencimiento: string = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private prestamoService: PrestamoService,
    private socioService: SocioService
  ) {

    // Obtener socios cargados
    this.socios =
      this.socioService.obtenerSocios();


    // ========================================
    // FECHA DE INICIO
    // ========================================

    const hoy = new Date();


    // ========================================
    // FECHA DE VENCIMIENTO
    // 30 DÍAS DESPUÉS
    // ========================================

    const vencimiento = new Date(hoy);

    vencimiento.setDate(
      vencimiento.getDate() + 30
    );


    // Guardar fechas
    this.fechaInicio =
      this.formatearFecha(hoy);

    this.fechaVencimiento =
      this.formatearFecha(vencimiento);
  }


  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

  private formatearFecha(fecha: Date): string {

    const año =
      fecha.getFullYear();

    const mes =
      String(
        fecha.getMonth() + 1
      ).padStart(2, '0');

    const dia =
      String(
        fecha.getDate()
      ).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
  }


  // ==========================================
  // CREAR PRÉSTAMO
  // ==========================================

  crearPrestamo(): void {

    // Verificar campos
    if (
      !this.idSocio ||
      !this.libro.trim() ||
      !this.inventario.trim()
    ) {

      alert('Completá todos los campos.');

      return;
    }


    // ========================================
    // OBTENER PRÉSTAMOS ACTUALES
    // ========================================

    const prestamos =
      this.prestamoService.obtenerPrestamos();


    // ========================================
    // GENERAR ID AUTOMÁTICAMENTE
    // ========================================

    const numero =
      prestamos.length + 1;

    const id =
      `PR${String(numero).padStart(3, '0')}`;


    // ========================================
    // CONVERTIR FECHAS
    // ========================================

    const fechaInicio =
      this.convertirFecha(
        this.fechaInicio
      );

    const fechaVencimiento =
      this.convertirFecha(
        this.fechaVencimiento
      );


    // ========================================
    // CREAR NUEVO PRÉSTAMO
    // ========================================

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


    // ========================================
    // GUARDAR PRÉSTAMO
    // ========================================

    this.prestamoService.agregarPrestamo(
      nuevoPrestamo
    );


    // ========================================
    // CERRAR MODAL
    // ========================================

    this.cerrar.emit();
  }


  // ==========================================
  // CONVERTIR FECHA
  // ==========================================

  private convertirFecha(
    fecha: string
  ): string {

    const partes =
      fecha.split('-');

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