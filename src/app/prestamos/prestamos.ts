import {
  Component,
  ChangeDetectorRef,
  NgZone,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Subscription
} from 'rxjs';

import {
  ActivatedRoute
} from '@angular/router';

import Swal from 'sweetalert2';

import {
  Prestamo,
  EstadoPrestamo
} from '../models/models/prestamo';

import {
  PrestamoService
} from '../services/prestamo';

import {
  Socio
} from '../models/models/socio';

import {
  SocioServicio
} from '../services/socio';

import {
  LibroService,
  Libro,
  Copia
} from '../services/libro-service';

import {
  ActividadServicio
} from '../services/actividade-service';


type FiltroPrestamo =
  | 'todos'
  | 'activo'
  | 'atrasado'
  | 'suspendido';


@Component({

  selector: 'app-prestamos',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './prestamos.html',

  styleUrl: './prestamos.css'

})
export class Prestamos
  implements OnInit, OnDestroy {


  prestamos: Prestamo[] = [];


  librosDisponibles:
    Libro[] = [];


  busqueda: string = '';


  filtro:
    FiltroPrestamo = 'todos';


  readonly opcionesFiltro:
    {
      valor: FiltroPrestamo;
      etiqueta: string;
    }[] = [

    {
      valor: 'todos',
      etiqueta: 'Todos'
    },

    {
      valor: 'activo',
      etiqueta: 'Activo'
    },

    {
      valor: 'atrasado',
      etiqueta: 'Vencidos'
    },

    {
      valor: 'suspendido',
      etiqueta: 'Suspendidos'
    },

  ];


  isModalOpen = false;


  socioSeleccionadoId:
    number | null = null;

  busquedaSocio = '';


  libroSeleccionadoId:
    string = '';

  busquedaLibro = '';


  inventario:
    string = '';


  copiasDisponiblesParaPrestamo:
    Copia[] = [];


  fechaInicio:
    string = '';


  fechaVencimiento:
    string = '';


  private sub:
    Subscription =
      new Subscription();


  constructor(

    private prestamoService:
      PrestamoService,

    private socioService:
      SocioServicio,

    private libroService:
      LibroService,

    private actividadServicio:
      ActividadServicio,

    private ngZone:
      NgZone,

    private changeDetector:
      ChangeDetectorRef,

    private route:
      ActivatedRoute

  ) {}


  // ==========================================
  // INICIO
  // ==========================================

  ngOnInit(): void {

    this.actualizarPrestamos();


    this.sub =
      this.libroService.libros$
        .subscribe(
          libros => {

            this.librosDisponibles =
              libros.filter(
                l =>
                  l.copias > 0
              );

          }
        );


    this.sub.add(
      this.route.queryParams.subscribe(
        params => {
          this.busqueda =
            params['libro'] || '';

          if (
            params['mostrarNuevoPrestamo'] ===
            'true'
          ) {

            this.openModal();

          }
        }
      )
    );

  }


  // ==========================================
  // DESTRUIR
  // ==========================================

  ngOnDestroy(): void {

    this.sub.unsubscribe();

  }


  // ==========================================
  // SOCIOS DISPONIBLES
  // ==========================================

  get sociosDisponibles(): Socio[] {

    return this.socioService
      .tenerSocios()
      .filter(
        s =>
          s.estado === 'activo' &&
          !this.prestamoService
            .obtenerPrestamos()
            .some(
              prestamo =>
                prestamo.socioId === s.id &&
                prestamo.estado !== 'devuelto'
            )
      );

  }

  get sociosFiltradosPorBusqueda(): Socio[] {
    const termino = this.busquedaSocio.trim().toLowerCase();
    if (!termino) {
      return [];
    }

    return this.sociosDisponibles.filter(socio =>
      [socio.nombre, socio.dni, socio.numCarnet]
        .some(valor => String(valor ?? '').toLowerCase().includes(termino))
    );
  }

  actualizarBusquedaSocio(): void {
    this.socioSeleccionadoId = null;
  }

  seleccionarSocio(socio: Socio): void {
    this.socioSeleccionadoId = socio.id;
    this.busquedaSocio = `${socio.nombre} (DNI: ${socio.dni})`;
  }

  get librosFiltradosPorBusqueda(): Libro[] {
    const termino = this.busquedaLibro.trim().toLowerCase();
    if (!termino) {
      return [];
    }

    return this.librosDisponibles.filter(libro =>
      [libro.titulo, libro.autor, libro.id]
        .some(valor => String(valor ?? '').toLowerCase().includes(termino))
    );
  }

  actualizarBusquedaLibro(): void {
    this.libroSeleccionadoId = '';
    this.inventario = '';
    this.onLibroChange();
  }

  seleccionarLibro(libro: Libro): void {
    this.libroSeleccionadoId = libro.id;
    this.busquedaLibro = libro.titulo;
    this.onLibroChange();
  }


  // ==========================================
  // ACTUALIZAR PRÉSTAMOS
  // ==========================================

  actualizarPrestamos(): void {

    this.prestamos =
      this.prestamoService
        .obtenerPrestamos()
        .filter(
          p =>
            p.estado !== 'devuelto'
        );

  }


  // ==========================================
  // FILTRAR PRÉSTAMOS
  // ==========================================

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


  // ==========================================
  // CAMBIAR FILTRO
  // ==========================================

  cambiarFiltro(
    filtro: FiltroPrestamo
  ): void {

    this.filtro =
      filtro;

  }


  // ==========================================
  // CAMBIO DE LIBRO
  // ==========================================

  onLibroChange(): void {

    this.inventario = '';


    const libroObj =
      this.librosDisponibles.find(
        l =>
          l.id ===
          this.libroSeleccionadoId
      );


    this.copiasDisponiblesParaPrestamo =
      libroObj
        ? libroObj.listaCopias.filter(
            c =>
              c.estado ===
              'Disponible'
          )
        : [];

  }


  // ==========================================
  // FECHA
  // ==========================================

  private obtenerFechaFormateada(
    meses: number = 0
  ): string {

    const fecha =
      new Date();


    fecha.setMonth(
      fecha.getMonth() + meses
    );


    return fecha
      .toISOString()
      .split('T')[0];

  }


  // ==========================================
  // ABRIR MODAL
  // ==========================================

  openModal(): void {

    this.isModalOpen = true;
    this.socioSeleccionadoId = null;
    this.busquedaSocio = '';
    this.libroSeleccionadoId = '';
    this.busquedaLibro = '';
    this.inventario = '';
    this.copiasDisponiblesParaPrestamo = [];


    this.fechaInicio =
      this.obtenerFechaFormateada(0);


    this.fechaVencimiento =
      this.obtenerFechaFormateada(1);

  }


  // ==========================================
  // CERRAR MODAL
  // ==========================================

  closeModal(): void {

    this.isModalOpen = false;


    this.socioSeleccionadoId =
      null;

    this.busquedaSocio = '';


    this.libroSeleccionadoId =
      '';

    this.busquedaLibro = '';


    this.inventario =
      '';


    this.copiasDisponiblesParaPrestamo =
      [];

  }


  // ==========================================
  // CREAR PRÉSTAMO
  // ==========================================

  async crearPrestamo(): Promise<boolean> {

    if (
      !this.socioSeleccionadoId ||
      !this.libroSeleccionadoId ||
      !this.inventario.trim()
    ) {

      return false;

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


    const libroObj =
      this.librosDisponibles.find(
        l =>
          l.id ===
          this.libroSeleccionadoId
      );


    if (
      !socioObj ||
      !libroObj
    ) {

      return false;

    }

    const confirmado = await this.confirmar(
      '¿Estás seguro?',
      `¿Deseas registrar el préstamo de "${libroObj.titulo}" para ${socioObj.nombre}?`,
      'Agregar'
    );

    if (!confirmado) {
      return false;
    }


    const nuevoPrestamo: Prestamo & {
      libroId?: string
    } = {

      id:
        `PR${String(
          this.prestamoService
            .obtenerPrestamos()
            .length + 1
        ).padStart(3, '0')}`,


      // ====================================
      // IMPORTANTE
      // GUARDAMOS EL ID DEL SOCIO
      // ====================================

      socioId:
        socioObj.id,


      // Nombre que se muestra
      socio:
        socioObj.nombre,


      libro:
        libroObj.titulo,


      libroId:
        libroObj.id,


      inventario:
        this.inventario.trim(),


      fechaInicio:
        this.fechaInicio,


      fechaVencimiento:
        this.fechaVencimiento,


      estado:
        'activo',


      renovaciones:
        0

    };


    if (
      this.prestamoService
        .agregarPrestamo(
          nuevoPrestamo
        )
    ) {

      this.socioService
        .actualizarEstadoPrestamo(
          socioObj.id,
          'En curso'
        );

      this.actividadServicio.registrarActividad(
        'prestamo',
        `Nuevo préstamo: ${libroObj.titulo} para ${socioObj.nombre} (copia ${nuevoPrestamo.inventario})`,
        nuevoPrestamo.id
      );


      this.ngZone.run(() => {
        this.actualizarPrestamos();
        this.closeModal();
        this.changeDetector.detectChanges();
      });

      await Swal.fire({
        title: '¡Préstamo registrado!',
        text: `El préstamo de "${libroObj.titulo}" para ${socioObj.nombre} se guardó exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: false,
      });

      return true;

    }


    return false;

  }


  async eliminarPrestamo(prestamo: Prestamo): Promise<void> {
    const confirmado = await this.confirmar(
      '¿Eliminar préstamo?',
      `Se eliminará el préstamo de "${prestamo.libro}" para ${prestamo.socio} y se registrará la eliminación en Actividad.`,
      'Eliminar'
    );

    if (!confirmado) {
      return;
    }

    const eliminado = this.prestamoService.eliminarPrestamo(prestamo.id);
    if (!eliminado) {
      return;
    }

    this.actividadServicio.eliminarActividadRelacionada(
      'prestamo',
      eliminado.id
    );
    this.actividadServicio.registrarActividad(
      'eliminacion',
      `Préstamo eliminado: ${eliminado.libro} para ${eliminado.socio} (copia ${eliminado.inventario})`,
      eliminado.id
    );

    const tieneOtroPrestamoActivo = this.prestamoService
      .obtenerPrestamos()
      .some(otro =>
        otro.socioId === eliminado.socioId && otro.estado !== 'devuelto'
      );

    if (!tieneOtroPrestamoActivo) {
      this.socioService.actualizarEstadoPrestamo(
        eliminado.socioId,
        'Libre'
      );
    }

    this.ngZone.run(() => {
      this.actualizarPrestamos();
      this.changeDetector.detectChanges();
    });

    await Swal.fire({
      title: 'Préstamo eliminado',
      text: 'El préstamo fue eliminado y quedó registrado en Actividad.',
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  // ==========================================
  // RENOVAR PRÉSTAMO
  // ==========================================

  renovarPrestamo(
    prestamo: Prestamo
  ): void {

    const socioObj =
      this.socioService
        .tenerSocios()
        .find(
          s =>
            s.id ===
            prestamo.socioId
        );


    this.prestamoService
      .renovarPrestamo(
        prestamo.id
      );

    const actualizado =
      this.prestamos.find(p => p.id === prestamo.id) || prestamo;

    this.actividadServicio.registrarActividad(
      'prestamo',
      `Préstamo renovado: ${actualizado.libro} para ${actualizado.socio}; vence ${actualizado.fechaVencimiento}`,
      actualizado.id
    );


    this.actualizarPrestamos();


    if (
      socioObj?.telefono
    ) {

      const mensaje =
        `Hola ${socioObj.nombre}, ` +
        `se ha renovado tu préstamo ` +
        `del libro "${actualizado.libro}". ` +
        `Vence el ` +
        `${actualizado.fechaVencimiento}.`;


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


      window.open(

        `https://wa.me/${tel}` +
        `?text=${encodeURIComponent(
          mensaje
        )}`,

        '_blank'

      );

    }

  }


  // ==========================================
  // DEVOLVER PRÉSTAMO
  // ==========================================

  devolverPrestamo(
    prestamo: Prestamo
  ): void {

    this.confirmar(

      '¿Estás seguro?',

      `¿Deseas devolver "${prestamo.libro}"?`,

      'Sí, devolver'

    ).then(
      confirmado => {

        if (!confirmado) {

          return;

        }


        const socioObj =
          this.socioService
            .tenerSocios()
            .find(
              s =>
                s.id ===
                prestamo.socioId
            );


        this.prestamoService
          .devolverPrestamo(
            prestamo.id
          );

        this.actividadServicio.registrarActividad(
          'prestamo',
          `Préstamo devuelto: ${prestamo.libro} por ${prestamo.socio}`,
          prestamo.id
        );


        if (socioObj) {

          this.socioService
            .actualizarEstadoPrestamo(
              socioObj.id,
              'Libre'
            );

        }


        this.actualizarPrestamos();

        this.changeDetector.detectChanges();

      }
    );

  }


  // ==========================================
  // SUSPENDER PRÉSTAMO
  // ==========================================

  suspenderPrestamo(
    prestamo: Prestamo
  ): void {

    this.confirmar(

      '¿Suspender préstamo?',

      `Se suspenderá el préstamo ` +
      `de "${prestamo.libro}" ` +
      `a nombre de ${prestamo.socio}.`,

      'Sí, suspender'

    ).then(
      confirmado => {

        if (!confirmado) {

          return;

        }


        this.prestamoService
          .suspenderPrestamo(
            prestamo.id
          );

        this.actividadServicio.registrarActividad(
          'prestamo',
          `Préstamo suspendido: ${prestamo.libro} para ${prestamo.socio}`,
          prestamo.id
        );


        this.socioService
          .actualizarEstadoSocio(
            prestamo.socioId,
            'suspendido'
          );


        this.actualizarPrestamos();

        this.changeDetector.detectChanges();

      }
    );

  }


  // ==========================================
  // QUITAR SUSPENSIÓN
  // ==========================================

  quitarSuspension(
    prestamo: Prestamo
  ): void {

    this.confirmar(

      '¿Quitar suspensión?',

      `El préstamo de "${prestamo.libro}" ` +
      `volverá a estar vigente.`,

      'Sí, quitar'

    ).then(
      confirmado => {

        if (!confirmado) {

          return;

        }


        this.prestamoService
          .quitarSuspension(
            prestamo.id
          );

        this.actividadServicio.registrarActividad(
          'prestamo',
          `Suspensión retirada: préstamo de ${prestamo.libro} para ${prestamo.socio}`,
          prestamo.id
        );


        const socioObj =
          this.socioService
            .tenerSocios()
            .find(
              s =>
                s.id ===
                prestamo.socioId
            );


        if (
          socioObj?.estado ===
          'suspendido'
        ) {

          this.socioService
            .actualizarEstadoSocio(
              prestamo.socioId,
              'activo'
            );

        }


        this.actualizarPrestamos();

        this.changeDetector.detectChanges();

      }
    );

  }


  // ==========================================
  // CONFIRMACIÓN
  // ==========================================

  private async confirmar(

    titulo: string,

    texto: string,

    textoConfirmar: string

  ): Promise<boolean> {

    const {
      isConfirmed
    } = await Swal.fire({

      title: titulo,

      text: texto,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor:
        '#0d9488',

      cancelButtonColor:
        '#ef4444',

      confirmButtonText:
        textoConfirmar,

      cancelButtonText:
        'Cancelar'

    });


    return isConfirmed;

  }

}