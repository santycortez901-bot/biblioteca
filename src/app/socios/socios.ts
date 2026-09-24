import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';


import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Socio, EstadoSocio, EstadoCuota } from '../models/models/socio';
import { SocioServicio } from '../services/socio';
import { ActividadServicio } from '../services/actividade-service';

@Component({


  selector: 'app-socios',


  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],


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

  // Filtros y Búsqueda
  busqueda: string = '';

  filtroEstado: string = 'Todos';

  filtroEdad: string = 'Todas edades';

  // Modal para Agregar Socio
  isModalOpen: boolean = false;
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

  constructor(
    private socioServicio: SocioServicio,
    private actividadServicio: ActividadServicio
  ) {}

  ngOnInit(): void {
    this.obtenerSocios();
  }

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

  // --- Modal Agregar Socio ---
  openModal(): void {

    this.isModalOpen =
      true;


    this.isModalOpen =
      true;

  }



  closeModal(): void {
    this.isModalOpen = false;
    this.limpiarFormularioNuevo();
  }


  limpiarFormularioNuevo(): void {
    this.nuevoNombre = '';


    this.nuevaEdad = null;


    this.nuevoDni = '';


    this.nuevoTelefono = '';


    this.nuevoEmail = '';


  }

  // =========================
  // AGREGAR SOCIO
  // =========================


  // =========================
  // AGREGAR SOCIO
  // =========================

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
      confirmButtonColor: '#0d9488'
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


    // Cerrar modal

    this.closeModal();


    // =========================
    // ALERTA DE ÉXITO
    // =========================

    Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Deseas editar el socio "${this.socioEnEdicion.nombre}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0d9488',
          cancelButtonColor: '#ef4444',
          confirmButtonText: 'Editar',
          cancelButtonText: 'Cancelar'
    });

  }
}

