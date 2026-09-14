import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Socio, EstadoSocio, PrestamoActual } from '../models/models/socio';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css'
})
export class Socios {
  isModalOpen = false;
  contadorSocio = 1;

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

      // Retorna verdadero solo si cumple con los 3 criterios
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
    // Reglas de validación en TS
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

    // Verificación de duplicados por DNI
    const dniLimpio = this.nuevoDni.trim();
    if (this.socios.some(s => s.dni.trim() === dniLimpio)) {
      alert('Error: Ya existe un socio registrado con este número de DNI.');
      return;
    }

    // Crear el nuevo socio
    const idSecuencia = this.contadorSocio.toString().padStart(3, '0');

    const nuevoSocio: Socio = {
      id: Number(this.contadorSocio),
      numCarnet: `c-${idSecuencia}`,
      nombre: this.nuevoNombre.trim(),
      edad: Number(this.nuevaEdad),
      dni: dniLimpio,
      telefono: this.nuevoTelefono.trim(),
      email: this.nuevoEmail.trim(),
      estado: 'activo' ,
      prestamos: 'Libre'
    };

    this.socios.push(nuevoSocio);
    this.contadorSocio++;
    this.closeModal();
  }
}