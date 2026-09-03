import { Component } from '@angular/core';
import { Socio } from '../models/models/socio';
import { SocioService } from '../services/socios-service';

@Component({
  selector: 'app-socios',
  imports: [],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios {

  filtroEstado: string = 'Todos';

  filtroEdad: string = 'Todas edades';

  socios: Socio[] = [];

  constructor(
    private socioService: SocioService
  ) {
    this.socios =
      this.socioService.obtenerSocios();
  }

  FiltroEstado(estado: string): void {
    this.filtroEstado = estado;
  }

  FiltroEdad(edad: string): void {
    this.filtroEdad = edad;
  }

  get sociosFiltrados(): Socio[] {

    return this.socios.filter(socio => {

      const cumpleEstado =
        this.filtroEstado === 'Todos' ||
        socio.estado === this.filtroEstado.toLowerCase();

      let cumpleEdad = true;

      if (this.filtroEdad === '+18') {
        cumpleEdad = socio.edad >= 18;
      }

      else if (this.filtroEdad === '-18') {
        cumpleEdad = socio.edad < 18;
      }

      return cumpleEstado && cumpleEdad;
    });
  }
}