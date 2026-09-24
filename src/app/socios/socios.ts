import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute
} from '@angular/router';

import Swal, {
  type SweetAlertIcon
} from 'sweetalert2';


import {
  Socio,
  EstadoSocio,
  EstadoCuota
} from '../models/models/socio';


import {
  SocioServicio
} from '../services/socio';


import {
  ActividadServicio
} from '../services/actividade-service';


import {
  PrestamoService
} from '../services/prestamo';


// =========================
// TIPOS Y CONSTANTES
// =========================

type FiltroEstado =
  'Todos' |
  EstadoSocio;


type FiltroEdad =
  'Todas edades' |
  '+18' |
  '-18';


interface OpcionFiltro<T> {

  valor: T;

  etiqueta: string;

}


interface FormSocio {

  nombre: string;

  edad: number | null;

  dni: string;

  telefono: string;

  email: string;

  estado: EstadoSocio;

}


interface ErrorValidacion {

  titulo: string;

  texto: string;

  icono: SweetAlertIcon;

}


const COLOR_PRIMARIO =
  '#0d9488';


const COLOR_PELIGRO =
  '#ef4444';


const EDAD_MINIMA =
  4;


const EDAD_MAYORIA =
  18;


const PATRONES_SOCIO = {

  nombre:
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/,

  dni:
    /^[0-9]{7,}$/,

  telefono:
    /^\+[0-9]{12}$/,

  email:
    /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/,

} as const;


const crearFormVacio =
  (): FormSocio => ({

    nombre: '',

    edad: null,

    dni: '',

    telefono: '',

    email: '',

    estado: 'activo',

  });


@Component({

  selector: 'app-socios',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl:
    './socios.html',

  styleUrl:
    './socios.css',

})
export class Socios
  implements OnInit {


  // =========================
  // ESTADO DE LA VISTA
  // =========================

  socios: Socio[] = [];


  busqueda = '';


  filtroEstado:
    FiltroEstado =
      'Todos';


  filtroEdad:
    FiltroEdad =
      'Todas edades';


  readonly opcionesEstado:
    OpcionFiltro<FiltroEstado>[] = [

    {
      valor: 'Todos',
      etiqueta: 'Todos'
    },

    {
      valor: 'activo',
      etiqueta: 'Activo'
    },

    {
      valor: 'suspendido',
      etiqueta: 'Suspendidos'
    },


    {
      valor: 'inactivo',
      etiqueta: 'Inactivos'
    },

  ];


  readonly opcionesEdad:
    OpcionFiltro<FiltroEdad>[] = [

    {
      valor: 'Todas edades',
      etiqueta: 'Todas edades'
    },

    {
      valor: '+18',
      etiqueta: '+18'
    },

    {
      valor: '-18',
      etiqueta: '-18'
    },

  ];


  // =========================
  // MODAL
  // =========================

  isModalOpen =
    false;


  socioEditandoId:
    number | null =
      null;


  form: FormSocio =
    crearFormVacio();


  readonly patrones =
    PATRONES_SOCIO;


  readonly edadMinima =
    EDAD_MINIMA;


  readonly estadosEditables:
    EstadoSocio[] = [

    'activo',

    'suspendido',

    'inactivo'

  ];


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(

    private route:
      ActivatedRoute,

    private ngZone:
      NgZone,

    private changeDetector:
      ChangeDetectorRef,

    private socioServicio:
      SocioServicio,

    private actividadServicio:
      ActividadServicio,

    private prestamoService:
      PrestamoService

  ) {}


  // =========================
  // CICLO DE VIDA
  // =========================

  ngOnInit(): void {

    this.obtenerSocios();


    this.route.queryParams
      .subscribe(

        (params) => {

          if (
            params['openModal'] ===
            'true'
          ) {

            this.openModal();

          }

        }

      );

  }


  // =========================
  // SOCIOS
  // =========================

  obtenerSocios(): void {

    this.socios =
      this.socioServicio
        .tenerSocios();

  }


  // =========================
  // FILTROS
  // =========================

  filtrarPorEstado(
    estado: FiltroEstado
  ): void {

    this.filtroEstado =
      estado;

  }


  filtrarPorEdad(
    edad: FiltroEdad
  ): void {

    this.filtroEdad =
      edad;

  }


  get sociosFiltrados():
    Socio[] {

    const termino =
      this.busqueda
        .trim()
        .toLowerCase();


    return this.socios.filter(

      (socio) =>

        this.cumpleBusqueda(
          socio,
          termino
        )

        &&

        this.cumpleEstado(
          socio
        )

        &&

        this.cumpleEdad(
          socio
        )

    );

  }


  private cumpleBusqueda(

    socio: Socio,

    termino: string

  ): boolean {

    if (!termino) {

      return true;

    }


    return [

      socio.nombre,

      socio.dni,

      socio.numCarnet

    ].some(

      (campo) =>

        String(campo ?? '')

          .toLowerCase()

          .includes(termino)

    );

  }


  private cumpleEstado(
    socio: Socio
  ): boolean {

    return (

      this.filtroEstado ===
      'Todos'

      ||

      socio.estado
        .toLowerCase() ===

      this.filtroEstado
        .toLowerCase()

    );

  }


  private cumpleEdad(
    socio: Socio
  ): boolean {

    switch (
      this.filtroEdad
    ) {

      case '+18':

        return (
          socio.edad >=
          EDAD_MAYORIA
        );


      case '-18':

        return (
          socio.edad <
          EDAD_MAYORIA
        );


      default:

        return true;

    }

  }


  // =========================
  // MODAL
  // =========================

  get esEdicion():
    boolean {

    return (
      this.socioEditandoId !==
      null
    );

  }


  openModal(): void {

    this.socioEditandoId =
      null;


    this.form =
      crearFormVacio();


    this.isModalOpen =
      true;

  }


  // ==========================================
  // ABRIR MODAL PARA EDITAR
  // ==========================================

  abrirModalEditar(
    socio: Socio
  ): void {

    this.socioEditandoId =
      socio.id;


    this.form = {

      nombre:
        socio.nombre,

      edad:
        socio.edad,

      dni:
        socio.dni,

      telefono:
        socio.telefono,

      email:
        socio.email,

      estado:
        socio.estado,

    };


    this.isModalOpen =
      true;

  }


  closeModal(): void {

    this.isModalOpen =
      false;


    this.socioEditandoId =
      null;


    this.form =
      crearFormVacio();

  }


  // =========================
  // GUARDAR
  // =========================

  async guardarSocio():
    Promise<void> {

    const error =
      this.validarFormulario();


    if (error) {

      await Swal.fire({

        title:
          error.titulo,

        text:
          error.texto,

        icon:
          error.icono,

        confirmButtonColor:
          COLOR_PRIMARIO,

      });


      return;

    }


    if (this.esEdicion) {

      await this.editarSocio();

    }

    else {

      await this.agregarSocio();

    }

  }


  // =========================
  // AGREGAR
  // =========================

  private async agregarSocio():
    Promise<void> {

    const datos =
      this.datosDelFormulario();


    const confirmado =
      await this.confirmar(

        '¿Estás seguro?',

        `¿Deseas agregar al socio "${datos.nombre}"?`,

        'Agregar'

      );


    if (!confirmado) {

      return;

    }


    const nuevoSocio:
      Omit<
        Socio,
        'id' | 'numCarnet'
      > = {

      ...datos,

      estado:
        'activo',

      prestamos:
        'Libre',

      cuota:
        'pendiente',

    };


    this.socioServicio
      .agregarSocio(
        nuevoSocio
      );


    this.actualizarVistaTrasGuardado();


    this.registrarActividad(

      `Nuevo socio registrado: ${datos.nombre}`,

      datos.dni

    );


    await this.mostrarExito(

      '¡Socio registrado!',

      `El socio "${datos.nombre}" ` +
      `se guardó exitosamente.`

    );


  }


  // =========================
  // EDITAR
  // =========================

  private async editarSocio():
    Promise<void> {

    const original =
      this.socios.find(

        (s) =>

          s.id ===
          this.socioEditandoId

      );


    if (!original) {

      return;

    }


    const datos =
      this.datosDelFormulario();


    const confirmado =
      await this.confirmar(

        '¿Estás seguro?',

        `¿Deseas editar al socio "${datos.nombre}"?`,

        'Editar'

      );


    if (!confirmado) {

      return;

    }


    // ==========================================
    // GUARDAMOS EL NOMBRE ANTERIOR
    // ==========================================

    const nombreAnterior =
      original.nombre;


    // ==========================================
    // CREAMOS EL SOCIO ACTUALIZADO
    // ==========================================

    const actualizado:
      Socio = {

      ...original,

      ...datos,

      estado:
        this.form.estado,

    };


    // ==========================================
    // ACTUALIZAMOS SOCIO
    // ==========================================

    this.socioServicio
      .actualizarSocio(
        actualizado
      );


    // ==========================================
    // ACTUALIZAMOS PRÉSTAMOS
    // ==========================================

    this.prestamoService
      .actualizarDatosSocio(

        actualizado.id,

        nombreAnterior,

        actualizado.nombre

      );


    this.actualizarVistaTrasGuardado();


    // ==========================================
    // REGISTRAMOS ACTIVIDAD
    // ==========================================

    this.registrarActividad(

      `Socio actualizado: ${actualizado.nombre}`,

      actualizado.dni

    );


    await this.mostrarExito(

      '¡Socio actualizado!',

      `Los datos de "${actualizado.nombre}" ` +
      `se guardaron.`

    );


  }


  private actualizarVistaTrasGuardado(): void {

    setTimeout(() => this.ngZone.run(() => {

      this.obtenerSocios();
      this.closeModal();
      this.changeDetector.detectChanges();

    }));

  }


  // =========================
  // VALIDACIONES
  // =========================
  
  private validarFormulario():
    ErrorValidacion | null {

    const {

      nombre,

      edad,

      dni,

      telefono,

      email

    } =
      this.datosDelFormulario();


    if (
      !PATRONES_SOCIO.nombre
        .test(nombre)
    ) {

      return this.error(

        'Nombre inválido',

        'El nombre debe contener ' +
        'al menos dos palabras.'

      );

    }


    if (
      !edad ||
      edad < EDAD_MINIMA
    ) {

      return this.error(

        'Edad inválida',

        `La edad debe ser de al menos ` +
        `${EDAD_MINIMA} años.`

      );

    }


    if (
      !PATRONES_SOCIO.dni
        .test(dni)
    ) {

      return this.error(

        'DNI inválido',

        'El DNI debe tener un mínimo ' +
        'de 7 dígitos numéricos.'

      );

    }


    if (
      !PATRONES_SOCIO.telefono
        .test(telefono)
    ) {

      return this.error(

        'Teléfono inválido',

        'El teléfono debe iniciar con "+" ' +
        'seguido de 12 dígitos.'

      );

    }


    if (
      !PATRONES_SOCIO.email
        .test(email)
    ) {

      return this.error(

        'Correo inválido',

        'El correo debe ser de dominio ' +
        '@gmail.com o @hotmail.com.'

      );

    }


    if (
      this.dniDuplicado(dni)
    ) {

      return this.error(

        'Socio duplicado',

        'Ya existe un socio registrado ' +
        'con este número de DNI.',

        'error'

      );

    }


    return null;

  }


  private dniDuplicado(
    dni: string
  ): boolean {

    return this.socios.some(

      (s) =>

        s.id !==
        this.socioEditandoId

        &&

        String(s.dni)
          .trim() ===
        dni

    );

  }


  private error(

    titulo: string,

    texto: string,

    icono:
      SweetAlertIcon =
        'warning'

  ): ErrorValidacion {

    return {

      titulo,

      texto,

      icono

    };

  }


  // =========================
  // HELPERS
  // =========================

  private datosDelFormulario() {

    const {

      nombre,

      edad,

      dni,

      telefono,

      email

    } =
      this.form;


    return {

      nombre:
        nombre.trim(),

      edad:
        Number(edad),

      dni:
        dni.trim(),

      telefono:
        telefono.trim(),

      email:
        email.trim(),

    };

  }


  private registrarActividad(

    descripcion: string,

    idRelacionado: string

  ): void {

    this.actividadServicio
      .agregarActividad({

        tipo:
          'socio',

        descripcion,

        fecha:
          new Date()
            .toLocaleDateString(
              'es-AR'
            ),

        user:
          'admin',

        idrelacionado:
          idRelacionado,

      });

  }


  private async confirmar(

    titulo: string,

    texto: string,

    textoConfirmar: string

  ): Promise<boolean> {

    const {
      isConfirmed
    } =
      await Swal.fire({

        title:
          titulo,

        text:
          texto,

        icon:
          'warning',

        showCancelButton:
          true,

        confirmButtonColor:
          COLOR_PRIMARIO,

        cancelButtonColor:
          COLOR_PELIGRO,

        confirmButtonText:
          textoConfirmar,

        cancelButtonText:
          'Cancelar',

      });


    return isConfirmed;

  }


  private mostrarExito(

    titulo: string,

    texto: string

  ): Promise<void> {

    return Swal.fire({

      title:
        titulo,

      text:
        texto,

      icon:
        'success',

      confirmButtonColor:
        COLOR_PRIMARIO,

      timer:
        2000,

      showConfirmButton:
        false,

    }).then(() => undefined);

  }

}