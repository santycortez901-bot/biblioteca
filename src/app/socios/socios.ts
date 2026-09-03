import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Socio } from '../models/models/socio';
import { SocioService } from '../services/socios-service';

@Component({
  selector: 'app-socios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {

  filtroEstado: string = 'Todos';
  filtroEdad: string = 'Todas edades';

  busqueda: string = '';

  socios: Socio[] = [];

  // Modal
  isModalOpen: boolean = false;

  nuevoNombre: string = '';
  nuevaEdad: number = 0;
  nuevoDni: string = '';
  nuevoTelefono: string = '';
  nuevoEmail: string = '';

  constructor(
    private socioService: SocioService
  ) {
    this.socios = this.socioService.obtenerSocios();
  }

  FiltroEstado(estado: string): void {
    this.filtroEstado = estado;
  }

  FiltroEdad(edad: string): void {
    this.filtroEdad = edad;
  }

  get sociosFiltrados(): Socio[] {

    return this.socios.filter(socio => {

      // Búsqueda
      const textoBusqueda = this.busqueda.toLowerCase().trim();

      const cumpleBusqueda =
        socio.nombre.toLowerCase().includes(textoBusqueda) ||
        socio.dni.includes(textoBusqueda) ||
        socio.numCarnet.toLowerCase().includes(textoBusqueda);

      // Estado
      const cumpleEstado =
        this.filtroEstado === 'Todos' ||
        socio.estado === this.filtroEstado.toLowerCase();

      // Edad
      let cumpleEdad = true;

      if (this.filtroEdad === '+18') {

        cumpleEdad = socio.edad >= 18;

      } else if (this.filtroEdad === '-18') {

        cumpleEdad = socio.edad < 18;

      }

      return cumpleBusqueda && cumpleEstado && cumpleEdad;
    });
  }

  abrirModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.limpiarFormulario();
  }

  agregarSocio(): void {

    const nuevoSocio: Socio = {
      id: this.generarId(),
      nombre: this.nuevoNombre,
      dni: this.nuevoDni,
      numCarnet: this.generarCarnet(),
      edad: this.nuevaEdad,
      email: this.nuevoEmail,
      telefono: this.nuevoTelefono,
      estado: 'activo',
      prestamos: 'Libre'
    };

    this.socios.push(nuevoSocio);

    this.closeModal();
  }

  private generarId(): string {

    return 'S' + String(this.socios.length + 1).padStart(3, '0');

  }

  private generarCarnet(): string {

    return 'c-' + String(this.socios.length + 1).padStart(3, '0');

  }

  private limpiarFormulario(): void {

    this.nuevoNombre = '';
    this.nuevaEdad = 0;
    this.nuevoDni = '';
    this.nuevoTelefono = '';
    this.nuevoEmail = '';

  }

}