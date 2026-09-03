import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Socio } from '../models/models/socio';
import { FormsModule } from '@angular/forms'; // Importante para usar [(ngModel)]
import { CommonModule } from '@angular/common'; // <--- Importar aquí

@Component({
  selector: 'app-socios',
  imports: [FormsModule,CommonModule,RouterLink], // Agregamos FormsModule aquí
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
  // Control de la modal
  isModalOpen: boolean = false;

  busqueda: string = '';
  filtroEstado: string = 'Todos';
  filtroEdad: string = 'Todas edades';
  socios: Socio[] = [
    {
      id: 1,
      nombre: "Julieta Chiara",
      dni: '48123169',
      numCarnet: 'c-001',
      edad: 19,
      email: "julichi2345@gmail.com",
      telefono: '2991234567',
      estado: 'activo',
      prestamos:'Encurso'
    },{
      id: 2,
      nombre: "Ignacio Maldonado",
      dni:'48123329',
      numCarnet: 'c-002',
      edad: 19,
      email: "nachota12@gmail.com",
      telefono: '2993399772',
      estado: 'bloqueado',
      prestamos:'Libre'
    },{
      id: 3,
      nombre: "Lucio Candarle",
      dni:'48673322',
      numCarnet: 'c-003',
      edad: 18,
      email: "lulu99@gmail.com",
      telefono: '2994557766',
      estado: 'inactivo',
      prestamos:'Libre'
    },{id: 4,
      nombre: "Santiago Cortez",
      dni:'47471099',
      numCarnet: 'c-004',
      edad: 20,
      email: "reymegatonton@gmail.com",
      telefono: '2990099123',
      estado: 'suspendido',
      prestamos:'Encurso'}
  ];

  FiltroEstado(estado: string): void {
    this.filtroEstado = estado;
  }
  FiltroEdad(edad: string): void {
    this.filtroEdad = edad;
  }

  get sociosFiltrados(): Socio[] {
  // Preparamos el texto de búsqueda en minúsculas y sin espacios extra
  const termino = this.busqueda.toLowerCase().trim();

  return this.socios.filter(socio => {
    // Filtrado por Búsqueda (coincidencia en nombre, DNI o carnet)
    const cumpleBusqueda = !termino || 
      socio.nombre.toLowerCase().includes(termino) ||
      socio.dni.toLowerCase().includes(termino) ||
      socio.numCarnet.toLowerCase().includes(termino);

    // Filtrado por Estado
    const cumpleEstado = this.filtroEstado === 'Todos' || socio.estado === this.filtroEstado.toLowerCase();

    // Filtrado por Edad
    let cumpleEdad = true;
    if (this.filtroEdad === '+18') {
      cumpleEdad = socio.edad >= 18;
    } else if (this.filtroEdad === '-18') {
      cumpleEdad = socio.edad < 18;
    }

    return cumpleBusqueda && cumpleEstado && cumpleEdad;
  });

}
// Variables del formulario
  nuevoNombre: string = '';
  nuevaEdad: number | null = null;
  nuevoDni: string = '';
  nuevoTelefono: string = '';
  nuevoEmail: string = '';

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
  if (!this.nuevoNombre || !this.nuevoDni || !this.nuevaEdad) return;

  const nuevoSocio: Socio = {
    id: this.socios.length + 1,
    numCarnet: `c-00${this.socios.length + 1}`,
    nombre: this.nuevoNombre,
    edad: Number(this.nuevaEdad),
    dni: this.nuevoDni,
    telefono: this.nuevoTelefono,
    email: this.nuevoEmail,
    estado: 'inactivo',
    prestamos: 'Libre'
  };

  this.socios.push(nuevoSocio);

  this.closeModal();
}
}
