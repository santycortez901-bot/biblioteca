import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Socio } from '../models/models/socio'; 
import { SocioServicio } from '../services/socio';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  socios: Socio[] = [];

  // 1. Inyectamos el servicio en el constructor
  constructor(private socioServicio: SocioServicio) {}

  // 2. Cargamos los datos del servicio cuando se inicia el componente
  ngOnInit(): void {
    this.obtenerSocios();
  }

  obtenerSocios(): void {
    this.socios = this.socioServicio.tenerSocios();
  }

  // --- Métodos para cambiar los filtros activos ---
  FiltroEstado(estado: string): void {
    this.filtroEstado = estado;
  }

  FiltroEdad(edad: string): void {
    this.filtroEdad = edad;
  }

  // --- Getter combinando Búsqueda + Filtro Estado + Filtro Edad ---
  get sociosFiltrados(): Socio[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.socios.filter(socio => {
      // 1. Filtro por Búsqueda (Nombre, DNI o Carnet)
      const cumpleBusqueda =
        !termino ||
        socio.nombre.toLowerCase().includes(termino) ||
        socio.dni.toLowerCase().includes(termino) ||
        socio.numCarnet.toLowerCase().includes(termino);

      // 2. Filtro por Estado (Todos, Activo, Bloqueado, Baja/Inactivo)
      const cumpleEstado =
        this.filtroEstado === 'Todos' ||
        socio.estado.toLowerCase() === this.filtroEstado.toLowerCase();

      // 3. Filtro por Edad (Todas edades, +18, -18)
      let cumpleEdad = true;
      if (this.filtroEdad === '+18') {
        cumpleEdad = socio.edad >= 18;
      } else if (this.filtroEdad === '-18') {
        cumpleEdad = socio.edad < 18;
      }

      return cumpleBusqueda && cumpleEstado && cumpleEdad;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoNombre = '';
    this.nuevaEdad = null;
    this.nuevoDni = '';
    this.nuevoTelefono = '';
    this.nuevoEmail = '';
  }

  agregarSocio(): void {
    // Validaciones de formulario
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;
    const regexDni = /^[0-9]{7,}$/;
    const regexTelefono = /^\+[0-9]{12}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

    if (!this.nuevoNombre || !regexNombre.test(this.nuevoNombre.trim())) {
      alert('Error en Nombre: Debe contener al menos dos palabras.');
      return;
    }

    if (!this.nuevaEdad || this.nuevaEdad < 4) {
      alert('Error en Edad: Debe ser de al menos 4 años.');
      return;
    }

    if (!this.nuevoDni || !regexDni.test(this.nuevoDni.trim())) {
      alert('Error en DNI: Debe tener un mínimo de 7 dígitos.');
      return;
    }

    if (!this.nuevoTelefono || !regexTelefono.test(this.nuevoTelefono.trim())) {
      alert('Error en Teléfono: Debe iniciar con "+" seguido de 12 dígitos.');
      return;
    }

    if (!this.nuevoEmail || !regexEmail.test(this.nuevoEmail.trim())) {
      alert('Error en Correo: Debe ser @gmail.com o @hotmail.com.');
      return;
    }

    // Verificación de duplicados sobre la lista traída del servicio
    const dniLimpio = this.nuevoDni.trim();
    if (this.socios.some(s => s.dni.trim() === dniLimpio)) {
      alert('Error: Ya existe un socio registrado con este número de DNI.');
      return;
    }

    // El servicio genera el ID e incrementa el contador de manera segura
    const nuevoSocio: Omit<Socio, 'id' | 'numCarnet'> = {
      nombre: this.nuevoNombre.trim(),
      edad: Number(this.nuevaEdad),
      dni: dniLimpio,
      telefono: this.nuevoTelefono.trim(),
      email: this.nuevoEmail.trim(),
      estado: 'activo',
      prestamos: 'Libre'
    };

    // 3. Delegamos el guardado al servicio
    this.socioServicio.agregarSocio(nuevoSocio as Socio);

    // Actualizamos el arreglo local y cerramos modal
    this.obtenerSocios();
    this.closeModal();
  }
  
}