import { Component } from '@angular/core';
import { Socio } from '../models/models/socio';
import { FormsModule } from '@angular/forms'; // Importante para usar [(ngModel)]
@Component({
  selector: 'app-socios',
  imports: [FormsModule], // Agregamos FormsModule aquí
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
  busqueda: string = '';
  filtroEstado: string = 'Todos';
  filtroEdad: string = 'Todas edades';
  socios: Socio[] = [
    {
      id: "S001",
      nombre: "Julieta Chiara",
      dni: '48123169',
      numCarnet: 'c-001',
      edad: 19,
      email: "julichi2345@gmail.com",
      telefono: '2991234567',
      estado: 'activo',
      prestamos:'Encurso'
    },{
      id: "S002",
      nombre: "Ignacio Maldonado",
      dni:'48123329',
      numCarnet: 'c-002',
      edad: 19,
      email: "nachota12@gmail.com",
      telefono: '2993399772',
      estado: 'bloqueado',
      prestamos:'Libre'
    }
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



}
