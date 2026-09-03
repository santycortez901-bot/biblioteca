import { Injectable } from '@angular/core';
import { Socio } from '../models/models/socio';

@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private socios: Socio[] = [

    {
      id: 'S001',
      nombre: 'Julieta Chiara',
      dni: '48123169',
      numCarnet: 'c-001',
      edad: 19,
      email: 'julichi2345@gmail.com',
      telefono: '2991234567',
      estado: 'activo',
      prestamos: 'Encurso'
    },

    {
      id: 'S002',
      nombre: 'Ignacio Maldonado',
      dni: '48123329',
      numCarnet: 'c-002',
      edad: 19,
      email: 'nachota12@gmail.com',
      telefono: '2993399772',
      estado: 'bloqueado',
      prestamos: 'Libre'
    }

  ];

  obtenerSocios(): Socio[] {
    return this.socios;
  }

  obtenerSocioPorId(id: string): Socio | undefined {
    return this.socios.find(
      socio => socio.id === id
    );
  }

  agregarSocio(socio: Socio): void {
    this.socios.push(socio);
  }
}