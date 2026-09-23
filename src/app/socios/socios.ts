import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Socio } from '../models/models/socio';

import { SocioServicio } from '../services/socio';

import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';


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

  isModalOpen = false;


  // Variables para Búsqueda y Filtros

  busqueda: string = '';

  filtroEstado: string = 'Todos';

  filtroEdad: string = 'Todas edades';


  // Variables del Formulario

  nuevoNombre: string = '';

  nuevaEdad: number | null = null;

  nuevoDni: string = '';

  nuevoTelefono: string = '';

  nuevoEmail: string = '';


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

  openModal(): void {

    this.isModalOpen =
      true;

  }


  closeModal(): void {

    this.isModalOpen =
      false;

    this.limpiarFormulario();

  }


  limpiarFormulario(): void {

    this.nuevoNombre = '';

    this.nuevaEdad = null;

    this.nuevoDni = '';

    this.nuevoTelefono = '';

    this.nuevoEmail = '';

  }


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

      return;

    }


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

    });

  }

}