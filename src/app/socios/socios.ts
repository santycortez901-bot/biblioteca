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
  imports: [CommonModule, FormsModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css'
})
export class Socios implements OnInit {
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
    cuota: 'al dia' as EstadoCuota
  };

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

  FiltroEstado(estado: string): void {
    this.filtroEstado = estado;
  }

  FiltroEdad(edad: string): void {
    this.filtroEdad = edad;
  }

  // --- Modal Agregar Socio ---
  openModal(): void {
    this.isModalOpen = true;
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

  agregarSocio(): void {
    if (!this.nuevoNombre || !this.nuevaEdad || !this.nuevoDni) return;

    const carnetGenerado = `C-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevoSocio: Socio = {
      id: Date.now(),
      numCarnet: carnetGenerado,
      nombre: this.nuevoNombre.trim(),
      edad: Number(this.nuevaEdad),
      dni: this.nuevoDni.trim(),
      telefono: this.nuevoTelefono.trim(),
      email: this.nuevoEmail.trim(),
      estado: 'activo' as EstadoSocio,
      prestamos: 'Libre',

      cuota:  'pendiente'

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
      title: '¡Socio Registrado!',
      text: `Se dio de alta a ${nuevoSocio.nombre}.`,
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false
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
      title: '¡Socio Actualizado!',
      text: `Se guardaron los cambios para ${this.socioEnEdicion.nombre}.`,
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 1800,
      showConfirmButton: false
    });
  }
}