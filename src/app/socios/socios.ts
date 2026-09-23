import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
<<<<<<< ours
import Swal from 'sweetalert2';

import { Socio, EstadoSocio, EstadoCuota } from '../models/models/socio';
import { SocioServicio } from '../services/socio';
import { ActividadServicio } from '../services/actividade-service';
=======

import { Socio } from '../models/models/socio';

import { SocioServicio } from '../services/socio';

import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

>>>>>>> theirs

@Component({

  selector: 'app-socios',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './socios.html',

  styleUrl: './socios.css'

})


export class Socios implements OnInit {
  socios: Socio[] = [];

<<<<<<< ours
  // Filtros y Búsqueda
=======
  isModalOpen = false;


  // Variables para Búsqueda y Filtros

>>>>>>> theirs
  busqueda: string = '';

  filtroEstado: string = 'Todos';

  filtroEdad: string = 'Todas edades';

<<<<<<< ours
  // Modal para Agregar Socio
  isModalOpen: boolean = false;
=======

  // Variables del Formulario

>>>>>>> theirs
  nuevoNombre: string = '';

  nuevaEdad: number | null = null;

  nuevoDni: string = '';

  nuevoTelefono: string = '';

  nuevoEmail: string = '';
  errorDni: string = '';

  // Modal para Editar Socio
  mostrarModalEditar: boolean = false;
  socioEnEdicion: Socio = {
    id: 0,
    nombre: '',
    dni: '',
    numCarnet: '',
    edad: 0,
    email: '',
    telefono: '',
    estado: 'activo' as EstadoSocio,
    prestamos: 'Libre',
    cuota: 'pagada' as EstadoCuota
  };

<<<<<<< ours
  constructor(
    private socioServicio: SocioServicio,
    private actividadServicio: ActividadServicio
  ) {}

  ngOnInit(): void {
    this.obtenerSocios();
  }

  obtenerSocios(): void {
    if (typeof this.socioServicio.tenerSocios === 'function') {
      this.socios = this.socioServicio.tenerSocios();
    } else if (typeof (this.socioServicio as any).getSocios === 'function') {
      this.socios = (this.socioServicio as any).getSocios();
    }
  }

  // --- Getter para filtrar socios dinámicamente en la tabla ---
  get sociosFiltrados(): Socio[] {
    return this.socios.filter(s => {
      // Búsqueda por Texto
      const coincidenciaTexto =
        s.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        s.dni.includes(this.busqueda) ||
        s.numCarnet.toLowerCase().includes(this.busqueda.toLowerCase());

      // Filtro por Estado
      const coincidenciaEstado =
        this.filtroEstado === 'Todos' || s.estado === this.filtroEstado;

      // Filtro por Edad
      let coincidenciaEdad = true;
      if (this.filtroEdad === '+18') {
        coincidenciaEdad = s.edad >= 18;
      } else if (this.filtroEdad === '-18') {
        coincidenciaEdad = s.edad < 18;
      }

      return coincidenciaTexto && coincidenciaEstado && coincidenciaEdad;
    });
  }
=======

  // Lista de socios

  socios: Socio[] = [];


  // NO TOCAR JULIETA ELUNEY CHIARA,
  // NO TOCAR NI BORRAR SINO ME ROMPES EL INICIO, GRACIAS
  // UN SOLO CONSTRUCTOR

  constructor(

    private route: ActivatedRoute,

    private socioServicio: SocioServicio

  ) {}


  // UN SOLO ngOnInit

  ngOnInit(): void {

    // Cargar socios

    this.obtenerSocios();


    // Abrir modal automáticamente
    // si viene el parámetro

    this.route.queryParams.subscribe(

      params => {

        if (
          params['openModal'] === 'true'
        ) {

          this.openModal();

        }

      }

    );

  }


  // HASTA ACA, DESPUES DE ESTO,
  // HACE LA VRG Q QIERAS, GRACIAS


  obtenerSocios(): void {

    this.socios =
      this.socioServicio
        .tenerSocios();

  }

>>>>>>> theirs

  // =========================
  // FILTROS
  // =========================

  FiltroEstado(
    estado: string
  ): void {

    this.filtroEstado =
      estado;

  }


  FiltroEdad(
    edad: string
  ): void {

    this.filtroEdad =
      edad;

  }

<<<<<<< ours
  // --- Modal Agregar Socio ---
=======

  // =========================
  // SOCIOS FILTRADOS
  // =========================

  get sociosFiltrados(): Socio[] {

    const termino =
      this.busqueda
        .trim()
        .toLowerCase();


    return this.socios.filter(

      socio => {

        // 1. Filtro por búsqueda

        const cumpleBusqueda =
          !termino ||

          socio.nombre
            .toLowerCase()
            .includes(termino)

          ||

          socio.dni
            .toLowerCase()
            .includes(termino)

          ||

          socio.numCarnet
            .toLowerCase()
            .includes(termino);


        // 2. Filtro por Estado

        const cumpleEstado =
          this.filtroEstado === 'Todos'

          ||

          socio.estado
            .toLowerCase() ===
          this.filtroEstado
            .toLowerCase();


        // 3. Filtro por Edad

        let cumpleEdad = true;


        if (
          this.filtroEdad === '+18'
        ) {

          cumpleEdad =
            socio.edad >= 18;

        }

        else if (
          this.filtroEdad === '-18'
        ) {

          cumpleEdad =
            socio.edad < 18;

        }


        return (

          cumpleBusqueda &&

          cumpleEstado &&

          cumpleEdad

        );

      }

    );

  }


  // =========================
  // MODAL
  // =========================

>>>>>>> theirs
  openModal(): void {

    this.isModalOpen =
      true;

  }


  closeModal(): void {
<<<<<<< ours
    this.isModalOpen = false;
    this.limpiarFormularioNuevo();
  }

  limpiarFormularioNuevo(): void {
=======

    this.isModalOpen =
      false;

    this.limpiarFormulario();

  }


  limpiarFormulario(): void {

>>>>>>> theirs
    this.nuevoNombre = '';

    this.nuevaEdad = null;

    this.nuevoDni = '';

    this.nuevoTelefono = '';

    this.nuevoEmail = '';

  }

<<<<<<< ours
agregarSocio(): void {
  this.errorDni = '';

  if (!this.nuevoNombre || !this.nuevaEdad || !this.nuevoDni) {
    return;
  }

  const dniLimpio = this.nuevoDni.trim();

  const existeDni = this.socios.some(
    s => s.dni?.toString().trim() === dniLimpio
  );

  if (existeDni) {
    this.errorDni = 'Ya existe un socio registrado con este DNI.';
    return;
  }
=======

  // =========================
  // AGREGAR SOCIO
  // =========================

  agregarSocio(): void {


    // Regex de validación

    const regexNombre =
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;


    const regexDni =
      /^[0-9]{7,}$/;


    const regexTelefono =
      /^\+[0-9]{12}$/;


    const regexEmail =
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;


    // =========================
    // VALIDACIÓN NOMBRE
    // =========================

    if (

      !this.nuevoNombre ||

      !regexNombre.test(
        this.nuevoNombre.trim()
      )

    ) {

      Swal.fire({

        title:
          'Nombre Inválido',

        text:
          'El nombre debe contener al menos dos palabras.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });
>>>>>>> theirs

  // Primero preguntar
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas agregar socio "${this.nuevoNombre.trim()}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0d9488',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Agregar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    // Si cancela, no hacemos nada
    if (!result.isConfirmed) {
      return;

    }

<<<<<<< ours
    // Recién después de confirmar generamos y agregamos
    const carnetGenerado = `C-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevoSocio: Socio = {
      id: Date.now(),
      numCarnet: carnetGenerado,
      nombre: this.nuevoNombre.trim(),
      edad: Number(this.nuevaEdad),
      dni: dniLimpio,
      telefono: this.nuevoTelefono.trim(),
      email: this.nuevoEmail.trim(),
      estado: 'activo' as EstadoSocio,
      prestamos: 'Libre',
      cuota: 'pendiente'
    };

    if (typeof (this.socioServicio as any).agregarSocio === 'function') {
      (this.socioServicio as any).agregarSocio(nuevoSocio);
    } else {
      this.socios.push(nuevoSocio);
    }

    if (typeof (this.actividadServicio as any).agregarActividad === 'function') {
      (this.actividadServicio as any).agregarActividad({
        tipo: 'socio',
        descripcion: `Nuevo socio registrado: ${nuevoSocio.nombre}`,
        fecha: new Date().toLocaleDateString('es-AR'),
        user: 'admin',
        idrelacionado: nuevoSocio.dni
      });
    }

    this.obtenerSocios();
    this.closeModal();

    Swal.fire({
      title: 'Socio agregado',
      text: `El socio "${nuevoSocio.nombre}" fue registrado correctamente.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    
  });
}

  // --- Modal Editar Socio ---
  abrirModalEditar(socio: Socio): void {
    this.socioEnEdicion = { ...socio };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  guardarEdicion(): void {
    if (!this.socioEnEdicion.id) return;

    if (typeof (this.socioServicio as any).actualizarSocio === 'function') {
      (this.socioServicio as any).actualizarSocio(this.socioEnEdicion);
    } else if (typeof (this.socioServicio as any).modificarSocio === 'function') {
      (this.socioServicio as any).modificarSocio(this.socioEnEdicion);
    }

    if (typeof (this.actividadServicio as any).agregarActividad === 'function') {
      (this.actividadServicio as any).agregarActividad({
        tipo: 'socio',
        descripcion: `Socio actualizado: ${this.socioEnEdicion.nombre}`,
        fecha: new Date().toLocaleDateString('es-AR'),
        user: 'admin',
        idrelacionado: this.socioEnEdicion.dni
      });
    }

    this.obtenerSocios();
    this.cerrarModalEditar();

    Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Deseas editar el socio "${this.socioEnEdicion.nombre}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0d9488',
          cancelButtonColor: '#ef4444',
          confirmButtonText: 'Editar',
          cancelButtonText: 'Cancelar'
=======

    // =========================
    // VALIDACIÓN EDAD
    // =========================

    if (

      !this.nuevaEdad ||

      this.nuevaEdad < 4

    ) {

      Swal.fire({

        title:
          'Edad Inválida',

        text:
          'La edad debe ser de al menos 4 años.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    // =========================
    // VALIDACIÓN DNI
    // =========================

    if (

      !this.nuevoDni ||

      !regexDni.test(
        this.nuevoDni.trim()
      )

    ) {

      Swal.fire({

        title:
          'DNI Inválido',

        text:
          'El DNI debe tener un mínimo de 7 dígitos numéricos.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    // =========================
    // VALIDACIÓN TELÉFONO
    // =========================

    if (

      !this.nuevoTelefono ||

      !regexTelefono.test(
        this.nuevoTelefono.trim()
      )

    ) {

      Swal.fire({

        title:
          'Teléfono Inválido',

        text:
          'El teléfono debe iniciar con "+" seguido de 12 dígitos.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    // =========================
    // VALIDACIÓN EMAIL
    // =========================

    if (

      !this.nuevoEmail ||

      !regexEmail.test(
        this.nuevoEmail.trim()
      )

    ) {

      Swal.fire({

        title:
          'Correo Inválido',

        text:
          'El correo debe ser de dominio @gmail.com o @hotmail.com.',

        icon:
          'warning',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    // =========================
    // VALIDACIÓN DUPLICADOS
    // =========================

    const dniLimpio =
      this.nuevoDni.trim();


    if (

      this.socios.some(

        s =>

          s.dni.trim() ===
          dniLimpio

      )

    ) {

      Swal.fire({

        title:
          'Socio Duplicado',

        text:
          'Ya existe un socio registrado con este número de DNI.',

        icon:
          'error',

        confirmButtonColor:
          '#0d9488'

      });

      return;

    }


    // =========================
    // CREAR SOCIO
    // =========================

    const nuevoSocio:
      Omit<
        Socio,
        'id' | 'numCarnet'
      > = {

      nombre:
        this.nuevoNombre.trim(),

      edad:
        Number(this.nuevaEdad),

      dni:
        dniLimpio,

      telefono:
        this.nuevoTelefono.trim(),

      email:
        this.nuevoEmail.trim(),

      estado:
        'activo',

      prestamos:
        'Libre'

    };


    // Guardar mediante el servicio

    this.socioServicio
      .agregarSocio(
        nuevoSocio
      );


    // Actualizar lista

    this.obtenerSocios();


    // Cerrar modal

    this.closeModal();


    // =========================
    // ALERTA DE ÉXITO
    // =========================

    Swal.fire({

      title:
        '¡Socio Registrado!',

      text:
        `El socio "${nuevoSocio.nombre}" se ha guardado exitosamente.`,

      icon:
        'success',

      confirmButtonColor:
        '#0d9488',

      timer:
        2000,

      showConfirmButton:
        false

>>>>>>> theirs
    });

  }
<<<<<<< ours
=======

>>>>>>> theirs
}