import { Component, NgZone } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import {
  Prestamo,
  EstadoPrestamo
} from '../models/models/prestamo';

import { PrestamoService } from '../services/prestamo';

import { Socio } from '../models/models/socio';

import { SocioServicio } from '../services/socio';


@Component({

  selector: 'app-prestamos',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './prestamos.html',

  styleUrl: './prestamos.css'

})


export class Prestamos {

  prestamos: Prestamo[] = [];

  busqueda: string = '';


  // =========================
  // FILTRO
  // =========================

  filtro:
    | 'todos'
    | 'activo'
    | 'atrasado'
    | 'suspendido'
    = 'todos';


  // =========================
  // MODAL NUEVO PRÉSTAMO
  // =========================

  isModalOpen = false;


  // =========================
  // FORMULARIO
  // =========================

  socioSeleccionadoId:
    number | null = null;

  libro: string = '';

  inventario: string = '';

  fechaInicio: string = '';

  fechaVencimiento: string = '';


  // =========================
  // MODAL SUSPENSIÓN
  // =========================

  isSuspensionModalOpen = false;

  prestamoASuspender:
    Prestamo | null = null;

  motivoSuspension: string = '';


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(

    private prestamoService:
      PrestamoService,

    private socioService:
      SocioServicio,

    private ngZone:
      NgZone

  ) {

    this.actualizarPrestamos();

  }


  // =========================
  // SOCIOS DISPONIBLES
  // =========================

  get sociosDisponibles(): Socio[] {

    return this.socioService

      .tenerSocios()

      .filter(

        s =>
          s.estado === 'activo'

      );

  }


  // =========================
  // ACTUALIZAR PRÉSTAMOS
  // =========================

  actualizarPrestamos(): void {

    this.prestamos =

      this.prestamoService

        .obtenerPrestamos()

        .filter(

          p =>
            p.estado !== 'devuelto'

        );

  }


  // =========================
  // FILTRAR PRÉSTAMOS
  // =========================

  get prestamosFiltrados(): Prestamo[] {

    const texto =

      this.busqueda

        .toLowerCase()

        .trim();


    return this.prestamos.filter(

      p => {

        if (
          p.estado === 'devuelto'
        ) {

          return false;

        }


        const coincideBusqueda =

          p.id

            .toLowerCase()

            .includes(texto)

          ||

          p.socio

            .toLowerCase()

            .includes(texto)

          ||

          p.libro

            .toLowerCase()

            .includes(texto)

          ||

          p.inventario

            .toLowerCase()

            .includes(texto);


        const coincideFiltro =

          this.filtro === 'todos'

          ||

          p.estado ===
          this.filtro;


        return (

          coincideBusqueda &&

          coincideFiltro

        );

      }

    );

  }


  // =========================
  // CAMBIAR FILTRO
  // =========================

  cambiarFiltro(

    filtro:
      | 'todos'
      | 'activo'
      | 'atrasado'
      | 'suspendido'

  ): void {

    this.filtro =
      filtro;

  }


  // =========================
  // OBTENER SOCIO
  // =========================

  obtenerSocio(

    identificador:
      number | string

  ): Socio | undefined {

    return this.socioService

      .tenerSocios()

      .find(

        s =>

          s.id === identificador

          ||

          s.nombre ===
          identificador

      );

  }


  // =========================
  // FECHAS
  // =========================

  private obtenerFechaFormateada(

    diasAgregar:
      number = 0

  ): string {

    const fecha =
      new Date();


    fecha.setDate(

      fecha.getDate() +
      diasAgregar

    );


    const año =
      fecha.getFullYear();


    const mes =

      String(

        fecha.getMonth() + 1

      ).padStart(

        2,
        '0'

      );


    const dia =

      String(

        fecha.getDate()

      ).padStart(

        2,
        '0'

      );


    return `${año}-${mes}-${dia}`;

  }


  // =========================
  // ABRIR MODAL NUEVO
  // =========================

  openModal(): void {

    this.isModalOpen =
      true;

    this.establecerFechasAutomaticas();

  }


  // =========================
  // FECHAS AUTOMÁTICAS
  // =========================

  establecerFechasAutomaticas(): void {

    this.fechaInicio =

      this.obtenerFechaFormateada(
        0
      );


    this.fechaVencimiento =

      this.obtenerFechaFormateada(
        30
      );

  }


  // =========================
  // LIMPIAR FORMULARIO
  // =========================

  limpiarFormulario(): void {

    this.socioSeleccionadoId =
      null;

    this.libro = '';

    this.inventario = '';

    this.fechaInicio = '';

    this.fechaVencimiento = '';

  }


  // =========================
  // CERRAR MODAL
  // =========================

  closeModal(): void {

    this.isModalOpen =
      false;

    this.limpiarFormulario();

  }


  // =========================
  // CREAR PRÉSTAMO
  // =========================

  crearPrestamo(): void {

    if (

      !this.socioSeleccionadoId ||

      !this.libro.trim() ||

      !this.inventario.trim() ||

      !this.fechaInicio ||

      !this.fechaVencimiento

    ) {

      Swal.fire({

        title:
          'Campos incompletos',

        text:
          'Por favor, completá todos los campos requeridos.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    const socioObj =

      this.socioService

        .tenerSocios()

        .find(

          s =>

            s.id ===

            Number(

              this.socioSeleccionadoId

            )

        );


    if (!socioObj) {

      return;

    }


    const listaActual =

      this.prestamoService

        .obtenerPrestamos();


    const numero =

      listaActual.length + 1;


    const idGenerado =

      `PR${String(numero).padStart(3, '0')}`;


    const nuevoPrestamo:
      Prestamo = {

      id:
        idGenerado,

      socio:
        socioObj.nombre,

      libro:
        this.libro.trim(),

      inventario:
        this.inventario.trim(),

      fechaInicio:
        this.fechaInicio,

      fechaVencimiento:
        this.fechaVencimiento,

      estado:
        'activo' as EstadoPrestamo,

      renovaciones:
        0

    };


    this.prestamoService

      .agregarPrestamo(

        nuevoPrestamo

      );


    this.socioService

      .actualizarEstadoPrestamo(

        socioObj.id,

        'Encurso'

      );


    this.actualizarPrestamos();

    this.closeModal();


    Swal.fire({

      title:
        '¡Préstamo Creado!',

      text:
        'Se creó el préstamo con éxito.',

      icon:
        'success',

      confirmButtonColor:
        '#0d9488',

      timer:
        2000,

      showConfirmButton:
        false

    });

  }


  // =========================
  // RENOVAR PRÉSTAMO
  // =========================

  renovarPrestamo(

    prestamo:
      Prestamo

  ): void {

    if (

      prestamo.renovaciones >= 2

    ) {

      return;

    }


    const socioObj =

      this.socioService

        .tenerSocios()

        .find(

          s =>

            s.nombre ===
            prestamo.socio

        );


    this.prestamoService

      .renovarPrestamo(

        prestamo.id

      );


    this.actualizarPrestamos();


    const prestamoActualizado =

      this.prestamos.find(

        p =>

          p.id ===
          prestamo.id

      ) || prestamo;


    if (

      socioObj &&

      socioObj.telefono

    ) {

      const mensaje =

        `Hola ${socioObj.nombre}, se ha renovado con éxito tu préstamo del libro "${prestamoActualizado.libro}". Tu nueva fecha de vencimiento es ${prestamoActualizado.fechaVencimiento}.`;


      let tel =

        socioObj.telefono

          .replace(

            /[^0-9]/g,

            ''

          );


      if (

        tel.startsWith('54') &&

        !tel.startsWith('549')

      ) {

        tel =

          '549' +
          tel.slice(2);

      }

      else if (

        !tel.startsWith('54')

      ) {

        tel =

          '549' +
          tel;

      }


      const url =

        `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;


      window.open(

        url,

        '_blank'

      );

    }

  }


  // =========================
  // DEVOLVER PRÉSTAMO
  // =========================

  devolverPrestamo(

    prestamo:
      Prestamo

  ): void {

    Swal.fire({

      title:
        '¿Estás seguro?',

      text:
        `¿Deseas marcar como devuelto el préstamo de "${prestamo.libro}"?`,

      icon:
        'warning',

      draggable:
        true,

      showCancelButton:
        true,

      confirmButtonColor:
        '#0d9488',

      cancelButtonColor:
        '#ef4444',

      confirmButtonText:
        'Sí, devolver',

      cancelButtonText:
        'Cancelar'

    }).then(result => {

      if (
        !result.isConfirmed
      ) {

        return;

      }


      this.ngZone.run(() => {


        // =========================
        // BUSCAR SOCIO
        // =========================

        const socioObj =

          this.socioService

            .tenerSocios()

            .find(

              s =>

                s.nombre ===
                prestamo.socio

            );


        // =========================
        // DEVOLVER PRÉSTAMO
        // =========================

        this.prestamoService

          .devolverPrestamo(

            prestamo.id

          );


        // =========================
        // ACTUALIZAR SOCIO
        // =========================

        if (socioObj) {

          this.socioService

            .actualizarEstadoPrestamo(

              socioObj.id,

              'Libre'

            );

        }


        // =========================
        // ACTUALIZAR LISTA
        // =========================

        this.actualizarPrestamos();


        // =========================
        // ALERTA
        // =========================

        Swal.fire({

          title:
            '¡Devuelto!',

          text:
            'El préstamo ha sido devuelto correctamente.',

          icon:
            'success',

          draggable:
            true,

          confirmButtonColor:
            '#0d9488',

          timer:
            2000,

          showConfirmButton:
            false

        });

      });

    });

  }


  // =========================
  // ABRIR SUSPENSIÓN
  // =========================

  abrirModalSuspension(

    prestamo:
      Prestamo

  ): void {

    this.prestamoASuspender =
      prestamo;

    this.motivoSuspension =
      '';

    this.isSuspensionModalOpen =
      true;

  }


  // =========================
  // CERRAR SUSPENSIÓN
  // =========================

  cerrarModalSuspension(): void {

    this.isSuspensionModalOpen =
      false;

    this.prestamoASuspender =
      null;

    this.motivoSuspension =
      '';

  }


  // =========================
  // CONFIRMAR SUSPENSIÓN
  // =========================

  confirmarSuspension(): void {

    if (
      !this.prestamoASuspender
    ) {

      return;

    }


    if (
      !this.motivoSuspension.trim()
    ) {

      Swal.fire({

        title:
          'Motivo requerido',

        text:
          'Debés ingresar el motivo de la suspensión.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    this.ngZone.run(() => {


      // =========================
      // SUSPENDER PRÉSTAMO
      // =========================

      this.prestamoService

        .suspenderPrestamo(

          this.prestamoASuspender!.id,

          this.motivoSuspension
            .trim()

        );


      // =========================
      // BUSCAR SOCIO
      // =========================

      const socioObj =

        this.socioService

          .tenerSocios()

          .find(

            s =>

              s.nombre ===

              this.prestamoASuspender!.socio

          );


      // =========================
      // SUSPENDER SOCIO
      // =========================

      if (socioObj) {

        this.socioService

          .actualizarEstadoSocio(

            socioObj.id,

            'suspendido'

          );

      }


      // =========================
      // ACTUALIZAR LISTA
      // =========================

      this.actualizarPrestamos();


      // =========================
      // CERRAR MODAL
      // =========================

      this.cerrarModalSuspension();


      // =========================
      // CONFIRMACIÓN
      // =========================

      Swal.fire({

        title:
          'Préstamo suspendido',

        text:
          'El préstamo y el socio fueron suspendidos correctamente.',

        icon:
          'success',

        confirmButtonColor:
          '#0d9488',

        timer:
          2000,

        showConfirmButton:
          false

      });

    });

  }


  // =========================
  // QUITAR SUSPENSIÓN
  // =========================

  quitarSuspension(

    prestamo:
      Prestamo

  ): void {

    Swal.fire({

      title:
        '¿Quitar suspensión?',

      text:
        `¿Querés quitar la suspensión del préstamo de "${prestamo.libro}"?`,

      icon:
        'question',

      showCancelButton:
        true,

      confirmButtonColor:
        '#0d9488',

      cancelButtonColor:
        '#ef4444',

      confirmButtonText:
        'Sí, quitar suspensión',

      cancelButtonText:
        'Cancelar'

    }).then(result => {

      if (
        !result.isConfirmed
      ) {

        return;

      }


      this.ngZone.run(() => {


        // =========================
        // BUSCAR PRÉSTAMO
        // =========================

        const prestamoActual =

          this.prestamoService

            .obtenerPrestamos()

            .find(

              p =>

                p.id ===
                prestamo.id

            );


        // =========================
        // REACTIVAR PRÉSTAMO
        // =========================

        if (prestamoActual) {

          prestamoActual.estado =
            'activo';

          prestamoActual.motivoSuspension =
            undefined;

        }


        // =========================
        // BUSCAR SOCIO
        // =========================

        const socioObj =

          this.socioService

            .tenerSocios()

            .find(

              s =>

                s.nombre ===
                prestamo.socio

            );


        // =========================
        // REACTIVAR SOCIO
        // =========================

        if (socioObj) {

          this.socioService

            .actualizarEstadoSocio(

              socioObj.id,

              'activo'

            );

        }


        // =========================
        // ACTUALIZAR LISTA
        // =========================

        this.actualizarPrestamos();


        // =========================
        // ALERTA
        // =========================

        Swal.fire({

          title:
            '¡Suspensión quitada!',

          text:
            'El préstamo y el socio volvieron a estar activos.',

          icon:
            'success',

          confirmButtonColor:
            '#0d9488',

          timer:
            2000,

          showConfirmButton:
            false

        });

      });

    });

  }

}