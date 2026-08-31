import { Component } from '@angular/core';
import { Socio } from '../models/models/socio';
@Component({
  selector: 'app-socios',
  imports: [],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {
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
    return this.socios.filter(socio => {
      // Filtrado por Estado
      const cumpleEstado = this.filtroEstado === 'Todos' || socio.estado === this.filtroEstado.toLowerCase();

      // Filtrado por Edad
      let cumpleEdad = true;
      if (this.filtroEdad === '+18') {
        cumpleEdad = socio.edad >= 18;
      } else if (this.filtroEdad === '-18') {
        cumpleEdad = socio.edad < 18;
      }

      return cumpleEstado && cumpleEdad;
    });
  }
}
